import { NextRequest, NextResponse } from "next/server";
import { UserChannelData } from "pusher";

import { PusherPresenceUserInfo, pusherServer } from "@/services/pusher";
import { authorizeApiRoute } from "@/services/lucia/functions";
import { getPlayer } from "@/services/react-query/queries/player";
import { CustomErrorCode, ICustomError } from "@/types";

/**
 * Authenticate users and provide every channel the user successfully subscribes to with their permanent DB data.
 *
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  return await authorizeApiRoute(req, async (session) => {
    const data = await req.text(); // contains socket id and channel name
    const socketId = data.split("&")[0].split("=")[1];
    const uid = "zob5s4teag4g3rq";

    // get player data for pusher
    const playerData = (await getPlayer(uid))?.data;
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

    // make user data accessible to all channels
    const userData = {
      id: uid,  // !! PUSHER MIGHT EXPECT A SOCKET ID
      user_info: { uid, socket_id: socketId, sprite: playerData.animalSprite, username: playerData.username } as PusherPresenceUserInfo,
    } as UserChannelData;
    const authRes = await pusherServer.authenticateUser(socketId, userData);
    console.log("user auth ", authRes)

    return new NextResponse(JSON.stringify(authRes));
  });
}
