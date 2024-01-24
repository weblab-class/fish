"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Members, PresenceChannel } from "pusher-js";

import InvitePopup from "@/components/InvitePopup";
import MailPopup from "@/components/MailPopup";

import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { useSignOut } from "@/services/react-query/auth";
import { useRouter } from "next/navigation";
import { useGetPlayer } from "@/services/react-query/queries/player";
import { PusherPresenceUserInfo, pusherClient } from "@/services/pusher";
import { useHomeStore, useMultiplayerStore } from "@/phaser/stores";
import { NextResponse } from "next/server";
import { CustomErrorCode, ICustomError } from "@/types";
import { PresenceChannelData } from "pusher";
import { create } from "zustand";
import axios from "axios";
import {
  IRequestDataParams,
  ISendDataParams,
  IRedirectParams,
} from "@/phaser/types";

// TODO  fix the clouds when you enter the house and then exit

const DynamicGame = dynamic(() => import("@/phaser/Game"), {
  ssr: false,
  loading: ({}) => (
    <div>
      Add your loading screen here. Note that this doesn&apos;t mean that the
      game finished loading, but rather the import is.
    </div>
  ),
});

interface IRedirectStoreState {
  redirect: boolean;
  errorCode: CustomErrorCode | null;
}
const useRedirectStore = create<IRedirectStoreState>((set) => ({
  redirect: false,
  errorCode: null,
}));

/**
 * The home page that wraps the Phaser game in cloud controls.
 *
 * This is also here all of the Pusher logic will go, as we need to...
 *  - seperate Pusher from Phaser
 *  - redirect unauthorized players from accessing other player's worlds (the game won't show up in time because it has to load)
 */
export default function Home({ params }: { params: { username: string } }) {
  // #region states
  const router = useRouter();
  const { session } = useLuciaSession();
  const signOutMutation = useSignOut();
  const { data: player } = useGetPlayer(session!.user.uid);
  const [authorized, setAuthorized] = useState<
    "waiting" | "authorized" | "unauthorized"
  >("waiting");

  // control display of game from client-side
  const [showInvitePopup, showMailPopup, showPopup, setDefault] = useHomeStore(
    (state) => [
      state.showInvitePopup,
      state.showMailPopup,
      state.showPopup,
      state.setDefault,
    ],
  );
  const inviteRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const [logoutClicked, setLogoutClicked] = useState(false);

  const [redirect, errorCode] = useRedirectStore((state) => [
    state.redirect,
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
    const homeChannelName = `presence-home-${params.username}`;

    const homeChannel = pusherClient.subscribe(
      homeChannelName,
    ) as PresenceChannel;

    // bindings
    homeChannel.bind("pusher:subscription_succeeded", async (_: Members) => {
      useRedirectStore.setState({ redirect: false, errorCode: null });

      // **NOTE: when the player has loaded in, that's when we init the store, add to the db, and send the data for others to add**
      setAuthorized("authorized");
    });

    homeChannel.bind(
      "pusher:subscription_error",
      // if error, redirect
      async (error: NextResponse<ICustomError>) => {
        console.log(error);
        setAuthorized("unauthorized");

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
      (leavingPlayer: { id: string; info: object }) => {
        if (leavingPlayer.id === session!.user.uid) {
          // reset multiplayer store
          //  - the store will be emptied, but will be populated by default values if they go back to their home
          useMultiplayerStore.getState().resetData();
          return;
        }

        // remove the player from their store
        useMultiplayerStore.getState().deleteOther(leavingPlayer.id);
      },
    );

    homeChannel.bind(
      "recieve-player-data",
      async ({ senderData, targetId }: ISendDataParams) => {
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
        console.log("HELLO OUTSIDE")
        // if there's no specific target ID, assume that this is for everyone, including the sender
        // if there is a specific target ID, only that person will be redirected
        if (!targetId || targetId === session!.user.uid) {
          console.log("HELLO");
          router.push(redirectLink);
        }
      },
    );

    return () => {
      if (!homeChannel.members.me) return; // this means subscription failed, so no point in unsubscribing and unbinding

      homeChannel.unbind();
      pusherClient.unsubscribe(`presence-home-${params.username}`);
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
                hostUsername={params.username}
                playerId={player.data._id}
                playerUsername={player.data.username}
                playerAnimalSprite={player.data.animalSprite}
              />
            )}
          </div>
          <div className="absolute bottom-3 left-3 z-10">
            <button
              className="rounded-md bg-red-400 px-1 py-3"
              onClick={async () => {
                // TODO put this somewhere better
                // TODO prevent someone from spam clicking this

                await axios.post(
                  `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/shared/redirect`,
                  {
                    channelName: `presence-home-${params.username}`,
                    redirectLink: `${process.env.NEXT_PUBLIC_DOMAIN}/game/${params.username}`,
                  } as IRedirectParams,
                );
              }}
            >
              Join Symphony Sentence Game
            </button>
          </div>
          {/* nav bar */}
          <div></div>
          <div
            className={`${logoutClicked && "pointer-events-none"} absolute inset-y-0 right-0 z-10 h-28 w-96 bg-[url('/objects/logoutCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:bg-[url('/objects/logoutCloudHover.png')]`}
            onClick={async () => {
              setLogoutClicked(true);
              await signOutMutation.mutateAsync();
              router.push(`${process.env.NEXT_PUBLIC_DOMAIN}`);
              setLogoutClicked(false);
            }}
          />
          <div
            className="absolute inset-y-0 right-80 z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/studyCloudHover.png')]"
            onClick={() => console.log("go to study room")}
          />
          <div
            className="absolute inset-y-0 left-0 z-10 h-28 w-96 bg-[url('/objects/multiplayerCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/multiplayerCloudHover.png')]"
            onClick={() => {
              console.log("hi mailajmailamalalalm");
              showPopup("invite");
            }}
          />
          <div
            className="absolute inset-y-0 left-72 z-10 h-28 w-96 bg-[url('/objects/mailCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/mailCloudHover.png')]"
            onClick={() => {
              console.log("hi mailajmailamalalalm");
              showPopup("mail");
            }}
          />
          <div className="absolute flex w-full justify-center">
            <div
              className="absolute inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/houseCloudHover.png')]"
              onClick={() => console.log("enter house")}
            />
          </div>
          {showInvitePopup && (
            <div className="flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-white"
                ref={inviteRef}
              >
                <InvitePopup hostId={session!.user.uid} />
              </div>
            </div>
          )}
          {showMailPopup && (
            <div className="flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-slate-200"
                ref={mailRef}
              >
                <MailPopup />
              </div>
            </div>
          )}
        </div>
      ) : (
        // TODO Make this much more interesting
        <p>Verifying...</p>
      )}
    </main>
  );
}
