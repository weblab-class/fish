"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Members, PresenceChannel } from "pusher-js";

import InvitePopup from "@/components/InvitePopup";
import MailPopup from "@/components/MailPopup";

import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useSignOut } from "@/services/react-query/auth";
import { useRouter } from "next/navigation";
import {
  getPlayerByUsername,
  useGetPlayer,
} from "@/services/react-query/queries/player";
import { PusherPresenceUserInfo, pusherClient } from "@/services/pusher";
import { useHomeStore, useMultiplayerStore } from "@/phaser/stores";
import { NextResponse } from "next/server";
import { CustomErrorCode, ICustomError } from "@/types";
import { PresenceChannelData } from "pusher";
import { create } from "zustand";
import axios from "axios";
import { ISendPlayerDataParams, IRedirectParams } from "@/phaser/types";
import ChatLog from "@/components/symphony/ChatLog";
import { deletePlayerFromRoom } from "@/services/react-query/mutations/player-room";
import HostClouds from "@/components/HostClouds";

const DynamicGame = dynamic(() => import("@/phaser/Game"), {
  ssr: false,
  loading: ({}) => (
    <div>
      Add your loading screen here. Note that this doesn&apos;t mean that the
      game finished loading, but rather the import is.
    </div>
  ),
});

interface IErrorRedirectStoreState {
  errorRedirect: boolean;
  errorCode: CustomErrorCode | null;
}
const useErrorRedirectStore = create<IErrorRedirectStoreState>((set) => ({
  errorRedirect: false,
  errorCode: null,
}));

interface IGameRedirectStoreState {
  gameRedirect: boolean;
}
const useGameRedirectStoreState = create<IGameRedirectStoreState>(() => ({
  gameRedirect: false,
}));

/**
 * The home page that wraps the Phaser game in cloud controls.
 *
 * This is also here all of the Pusher logic will go, as we need to...
 *  - seperate Pusher from Phaser
 *  - redirect unauthorized players from accessing other player's worlds (the game won't show up in time because it has to load)
 */
export default function Home({ params }: { params: { username: string } }) {
  const hostUsername = params.username;

  // #region states
  const router = useRouter();
  const { session } = useLuciaSession();
  const { data: player } = useGetPlayer(session!.user.uid);
  const [authorized, setAuthorized] = useState<
    "waiting" | "authorized" | "unauthorized"
  >("waiting");

  // control display of game from client-side
  const [setDefault] = useHomeStore((state) => [state.setDefault]);
  const inviteRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);

  const [redirect, errorCode] = useErrorRedirectStore((state) => [
    state.errorRedirect,
    state.errorCode,
  ]);
  // #endregion

  // #region useEffect
  // handle clicks outside of popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (mailRef.current && !mailRef.current.contains(event.target as Node)) ||
        (inviteRef.current && !inviteRef.current.contains(event.target as Node))
      ) {
        console.log(mailRef.current);
        console.log(event.target);
        setDefault();
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  // redirect
  useEffect(() => {
    if (redirect) {
      switch (errorCode) {
        case CustomErrorCode.DUPLICATE_TABS:
          router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/no-duplicate-tabs`);
          break;
        default:
          router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);
      }
    }
  }, [redirect]);

  // set up pusher
  useEffect(() => {
    const homeChannelName = `presence-home-${hostUsername}`;

    const homeChannel = pusherClient.subscribe(
      homeChannelName,
    ) as PresenceChannel;

    // bindings
    homeChannel.bind("pusher:subscription_succeeded", async (_: Members) => {
      useErrorRedirectStore.setState({ errorRedirect: false, errorCode: null });

      // **NOTE: when the player has loaded in, that's when we init the store, add to the db, and send the data for others to add**
      setAuthorized("authorized");
    });

    homeChannel.bind(
      "pusher:subscription_error",
      // if error, redirect
      async (error: NextResponse<ICustomError>) => {
        console.log(error);
        setAuthorized("unauthorized");
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/error`);

        // TODO fix .json() (maybe use zustand error store)
        // const { message: errMsg, code: errCode } =
        //   (await error.json()) as ICustomError;
        // const goRedirect = () =>
        //   useRedirectStore.setState({ redirect: true, errorCode: errCode });

        // switch (errCode) {
        //   case CustomErrorCode.DUPLICATE_TABS:
        //     const localUid = session!.user.uid;
        //     const localSocketId = pusherClient.connection.socket_id;

        //     // if the socket ID match between tab and channel, then we are on the right tab and hence it was a rerender issue, so DON'T REDIRECT
        //     if (localUid && localSocketId) {
        //       // if they exist (which they should exist)
        //       const storedUserInfo = (
        //         homeChannel as PresenceChannel
        //       ).members.get(localUid) as PresenceChannelData;
        //       if (storedUserInfo) {
        //         const { socket_id } =
        //           storedUserInfo.user_info! as PusherPresenceUserInfo;
        //         if (localSocketId === socket_id) {
        //           return;
        //         }
        //       }

        //       goRedirect();
        //     }
        //     break;
        //   default:
        //     console.error("Handle this error:", errCode);
        //     goRedirect();
        // }
      },
    );

    homeChannel.bind(
      "pusher:member_added",
      async (newPlayer: { id: string; info: PusherPresenceUserInfo }) => {
        if (newPlayer.id === session!.user.uid) return; // we don't want this to run on the same person

        useMultiplayerStore.getState().sendMyData({ to: newPlayer.id });
      },
    );

    homeChannel.bind(
      "pusher:member_removed",
      async (leavingPlayer: { id: string; info: object }) => {
        // if redirecting to a game, then don't clear anything because we might want to come back
        if (useGameRedirectStoreState.getState().gameRedirect) {
          useGameRedirectStoreState.setState({ gameRedirect: false });
          return;
        }

        if (leavingPlayer.id === session!.user.uid) {
          // reset multiplayer store
          //  - the store will be emptied, but will be populated by default values if they go back to their home
          useMultiplayerStore.getState().resetData();
          const host = await getPlayerByUsername(hostUsername);
          if (!host?.data?.at(0)) return;

          await deletePlayerFromRoom({
            hostId: host.data[0]._id.toString(),
            guestId: leavingPlayer.id,
          });
          return;
        }

        // remove the player from their store
        useMultiplayerStore.getState().deleteOther(leavingPlayer.id);
      },
    );

    homeChannel.bind(
      "recieve-player-data",
      async ({ senderData, targetId }: ISendPlayerDataParams) => {
        // if targetId doesn't exist, then it's meant for everyone besides the sender
        // if targetId does exist, then it's meant for that person
        if (
          (!targetId && senderData.uid !== session!.user.uid) ||
          targetId === session?.user.uid
        ) {
          useMultiplayerStore.getState().addOrUpdateOther(senderData);
        }
      },
    );

    homeChannel.bind(
      "redirect",
      async ({ redirectLink, targetId }: IRedirectParams) => {
        // if there's no specific target ID, assume that this is for everyone, including the sender
        // if there is a specific target ID, only that person will be redirected
        if (!targetId || targetId === session!.user.uid) {
          useGameRedirectStoreState.setState({ gameRedirect: true });
          router.push(redirectLink);
        }
      },
    );

    homeChannel.bind("change-scene", async () => {});

    return () => {
      useHomeStore.getState().resetData();

      homeChannel.unbind();
      pusherClient.unsubscribe(`presence-home-${hostUsername}`);
    };
  }, []);
  // #endregion

  return (
    <main>
      {authorized === "authorized" ? (
        <div>
          <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
            {player && player.data && (
              <DynamicGame
                hostUsername={hostUsername}
                playerId={player.data._id}
                playerUsername={player.data.username}
                playerAnimalSprite={player.data.animalSprite}
              />
            )}
          </div>
          <div className="absolute bottom-3 left-3 z-10">
            <button
              className="rounded-xl bg-[url(/backgrounds/blueBg.png)] p-2 text-3xl text-white outline"
              onClick={async () => {
                // TODO put this somewhere better
                // TODO prevent someone from spam clicking this

                await axios.post(
                  `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/shared/redirect`,
                  {
                    channelName: `presence-home-${hostUsername}`,
                    redirectLink: `${process.env.NEXT_PUBLIC_DOMAIN}/game/${hostUsername}`,
                  } as IRedirectParams,
                );
              }}
            >
              Join Sentence Symphony Game
            </button>
          </div>
          {/* TODO CHAT LOG FOR MULTIPLAYER PHASER */}
          {/* <div className="top-17 absolute bottom-0 right-0 z-50 ml-6 flex h-34% w-1/4 items-end p-1">
            <ChatLog
              username={player?.data ? player?.data?.username : "anonymous"}
              hostUsername={hostUsername}
            />
          </div> */}
          {/* nav bar */}
          {player?.data?.username === hostUsername ? (
            <HostClouds hostUsername={hostUsername} inviteRef={inviteRef} mailRef={mailRef} />
          ) : (
            <div>
              <p>Leave</p>
              <p>Logout</p>
            </div>
          )}
        </div>
      ) : authorized === "unauthorized" ? (
        // TODO Make this much more interesting
        <p>Authorization has failed</p>
      ) : (
        <div></div>
      )}
    </main>
  );
}
