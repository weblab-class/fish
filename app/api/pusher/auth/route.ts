import { NextRequest, NextResponse } from "next/server";
import { some as _some } from "lodash";

import {
  type PusherPresenceUserInfo,
  pusherServer,
  pusherClient,
} from "@/services/pusher";
import { authorizeApiRoute } from "@/services/lucia/functions";
import {
  CustomErrorCode,
  GAME_ROOM_PLAYER_STATUSES,
  ICustomError,
} from "@/types";
import { MAX_PLAYERS } from "@/phaser/settings/consts";
import { sendInvite } from "@/services/react-query/mutations/player-room";
import { getDefaultPosition } from "@/phaser/settings/functions";
import { getPlayer, getPlayerByUsername } from "@/services/react-query/queries/player";
import { getPlayerRoom } from "@/services/react-query/queries/player-room";
import { PresenceChannelData } from "pusher";

interface IChannelsRes {
  [channelName: string]: object;
}

// TODO Errors do not work because Pusher gets rid of the CustomErrorCode

/**
 * Authorize channels and users.
 * - For home channel, use `presence-home-${host username}`
 * - For sentence symphony regular channel, use `presence-ss-${host username}`
 * - For sentence symphony host channel, use `presence-ss-host-${host username}`
 * - For sentence symphony vote channel, use `presence-ss-vote-${host username}`
 * - For sentence symphony chat channel, use `presence-ss-chat-${host username}`
 *
 * @param req
 * @returns
 */

export async function POST(req: NextRequest) {
  return await authorizeApiRoute(req, async (session) => {
    const data = await req.text(); // contains socket id and channel name
    const socketId = data.split("&")[0].split("=")[1];
    const channelName = data.split("&")[1].split("=")[1];

    // player data (no matter if its the host or not)
    const playerUid = session.user.uid!;
    const playerData = (await getPlayer(playerUid))?.data;
    if (!playerData)
    return NextResponse.json(
      {
        message: "Player not found",
        code: CustomErrorCode.PLAYER_NOT_FOUND,
      } as ICustomError,
      {
        status: 404,
      },
    );

    const presenceData = {
      user_id: playerUid, 
      user_info: { uid: playerUid, socket_id: socketId, sprite: playerData.animalSprite, username: playerData.username } as PusherPresenceUserInfo,
    } as PresenceChannelData;

    // get host data for comparison
    const hostUsername = channelName.split("-").at(-1)!; // all channel names will end with host username
    const hostData = (await getPlayerByUsername(hostUsername))?.data;
    if (!hostData || hostData.length === 0)
      return NextResponse.json(
        {
          message: "Host not found",
          code: CustomErrorCode.HOST_NOT_FOUND,
        } as ICustomError,
        { status: 404 },
      );
    const host = hostData[0];
    const hostUid = host._id.toString();

    // make sure the user isn't opening more than one tab (see pusher:subscription_error in components that subscribe for the rest of the implementation)
    // NOTE: this is only for `presence-home-${host username}` & `presence-ss-${host username}`
    // NOTE: dev mode breaks this, so it's only available in prod
    if (
      process.env.NODE_ENV === "production" &&
      (channelName === `presence-home-${host.username}` ||
        channelName === `presence-ss-${host.username}`)
    ) {
      console.log("I AM CHECKING FOR DUPLICATE TABS");

      const usersRes = await pusherServer.get({
        path: `/channels/${channelName}/users`,
      });
      const usersBody = await usersRes.json();
      const userIds = (usersBody.users as { id: string }[]).map(({ id }) => id);
      if (userIds.includes(playerUid)) {
        // this might be a signal that the user created another tab, so check in the component
        return NextResponse.json(
          { message: socketId, code: CustomErrorCode.DUPLICATE_TABS },
          {
            status: 403,
            statusText: CustomErrorCode.DUPLICATE_TABS,
          },
        );
      }
    }

    // these next checks are for the HOME channels, since they will be handling the database
    // if you are doing a GAME channel, then handle it on your own page.tsx
    //  - games have to load in for everyone, hence the host might not be the first one
    //    to subscribe to their channel
    if (channelName.startsWith("presence-home-")) {
      // we need to authorize if they are joining someone else's channel
      if (playerUid !== hostUid) {
        console.log("NOW CHECKING AS A GUEST");

        /// make sure host is ONLINE (there has to be one that ends in the host username)
        const res = await pusherServer.get({
          path: "/channels",
          // no "presence-home-" because we want an accurate error msg (let's say if the host is online but not at their home)
          params: { filter_by_prefix: "presence-" },
        });
        if (res.status === 200) {
          const body = await res.json();
          const channelsInfo = body.channels as IChannelsRes;
          const allChannelNames = Object.getOwnPropertyNames(channelsInfo);

          const isHostOnline = _some(allChannelNames, (name) =>
            name.endsWith(hostUsername),
          );
          if (!isHostOnline) {
            return NextResponse.json(
              {
                message: "Host not online",
                code: CustomErrorCode.HOST_NOT_ONLINE,
              } as ICustomError,
              { status: 403 },
            );
          }
        } else
          throw new Error(
            "This is a developer error. Please make sure that Pusher server is working.",
          );

        /// get host's room
        const hostRoom = (await getPlayerRoom(hostUid))?.data;
        if (!hostRoom)
          return NextResponse.json(
            {
              message: "Host room not found",
              code: CustomErrorCode.HOST_ROOM_NOT_FOUND,
            } as ICustomError,
            { status: 404 },
          );

        // see if host is in game
        if (GAME_ROOM_PLAYER_STATUSES.includes(hostRoom.hostStatus)) {
          return NextResponse.json(
            {
              message: "Host is in a game",
              code: CustomErrorCode.HOST_IN_GAME,
            } as ICustomError,
            { status: 403 },
          );
        }

        // see if they are whitelisted
        if (!hostRoom.whitelist.includes(playerUid)) {
          return NextResponse.json(
            {
              message: "Player was not invited",
              code: CustomErrorCode.PLAYER_NOT_WHITELISTED,
            } as ICustomError,
            { status: 403 },
          );
        }

        // see if the room is full
        if (hostRoom.allPlayers.length === MAX_PLAYERS) {
          return NextResponse.json(
            {
              message: "Host room full",
              code: CustomErrorCode.HOST_ROOM_FULL,
            } as ICustomError,
            { status: 403 },
          );
        }

        /// SUCCESS! we will add them to the database
        console.log("AS A GUEST, I AM ADDING MYSELF TO THE HOST ROOM");

        await sendInvite({
          hostId: host._id.toString(),
          guestId: playerUid,
          ...getDefaultPosition(hostRoom.hostStatus),
        });
      }
    }

    const authRes = pusherServer.authorizeChannel(socketId, channelName, presenceData);

    return new NextResponse(JSON.stringify(authRes));
  });
}