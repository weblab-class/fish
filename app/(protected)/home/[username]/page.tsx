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
import { Player } from "@/services/mongo/models";
import { CustomErrorCode, ICustomError, PlayerRoomStatus } from "@/types";
import { PresenceChannelData } from "pusher";
import { create } from "zustand";
import axios from "axios";
import {
  ISendPlayerDataParams,
  IRedirectParams,
  IChangeSceneParams,
} from "@/phaser/types";
import ChatLog from "@/components/symphony/ChatLog";
import { deletePlayerFromRoom } from "@/services/react-query/mutations/player-room";
import ChatLogPhaser from "@/components/ChatLogPhaser";
import EaselPopup from "@/components/EaselPopup";
import Timer from "@/components/timer";
import Stopwatch from "@/components/stopwatch";
import { Data } from "phaser";
import { IoHelp, IoHelpCircle, IoHelpOutline } from "react-icons/io5";
import { IoMdHelp } from "react-icons/io";
import HelpPopup from "@/components/HelpPopup";
import { BsWindowSidebar } from "react-icons/bs";
import GamePopup from "@/components/GamePopup";

const DynamicGame = dynamic(async () => await import("@/phaser/Game"), {
  ssr: false,
  loading: ({}) => (
    <div>
      <div className="flex h-screen w-screen items-center justify-center bg-[url(/backgrounds/lightBlueBg.png)] bg-cover bg-no-repeat">
        <div className="h-fit w-fit rounded-full bg-[url(/backgrounds/greenBg.png)] outline-dashed outline-4 outline-white">
          <p className="animate-bounce p-16 pb-5 pl-20 pr-20 text-8xl text-white">
            Loading Game...
          </p>
        </div>
      </div>
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
  const signOutMutation = useSignOut();
  const { data: currentPlayer, refetch: refetchPlayer } = useGetPlayer(
    session!.user.uid,
    false,
  );
  const [authorized, setAuthorized] = useState<
    "waiting" | "authorized" | "unauthorized"
  >("waiting");

  // control display of game from client-side
  const [
    game,
    showInvitePopup,
    showMailPopup,
    showEaselPopup,
    showHelpPopup,
    showGameMenu,
    showPopup,
    setDefault,
  ] = useHomeStore((state) => [
    state.game,
    state.showInvitePopup,
    state.showMailPopup,
    state.showEaselPopup,
    state.showHelpPopup,
    state.showGameMenu,
    state.showPopup,
    state.setDefault,
  ]);

  const inviteRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const [currScene, setCurrScene] = useState("exterior");
  const [gameLoaded, setGameLoaded] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  // const [currentPlayer, setCurrentPlayer] = useState<Player | null>();
  // const time = new Date();
  // let total =
  //   // @ts-ignore
  //   document.getElementById("h")?.value * 60 * 60 +
  //   // @ts-ignore
  //   document.getElementById("m")?.value * 60 +
  //   // @ts-ignore
  //   document.getElementById("s")?.value;
  // time.setSeconds(time.getSeconds() + total);

  const [redirect, errorCode] = useErrorRedirectStore((state) => [
    state.errorRedirect,
    state.errorCode,
  ]);
  // #endregion

  // #region useEffect

  useEffect(() => {
    if (!game) return;
    if (game && !gameLoaded) {
      setGameLoaded(true);
    }

    const player = game.registry.get("player") as Phaser.GameObjects.Sprite;

    if (!player) return;
    if (!player.scene) return;
    const currSceneKey = player.scene.scene.key;

    if (currScene != currSceneKey) {
      // setCurrScene(currSceneKey);
    }
  });

  useEffect(() => {
    if (!currentPlayer) return;
    if (!currentPlayer.data) return;

    if (currentPlayer.data.username === params.username) {
      setIsHost(true);
    }
  }, [gameLoaded]);

  useEffect(() => {
    if (gameLoaded) return;
    refetchPlayer();
  });

  // handle clicks outside of popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (mailRef.current && !mailRef.current.contains(event.target as Node)) ||
        (inviteRef.current && !inviteRef.current.contains(event.target as Node))
      ) {
        setDefault();
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
  // TO DO: REMOVEE
  useEffect(() => {}, [currScene]);
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
      "pusher:member_added",
      async (newPlayer: { id: string; info: PusherPresenceUserInfo }) => {
        setDefault();

        if (newPlayer.id === session!.user.uid) return; // we don't want this to run on the same person
        useMultiplayerStore.getState().sendMyData({ to: newPlayer.id });

        const welcomeMessage =
          ":---" + newPlayer.info.username + " has arrived!---";
        axios.post("/api/pusher/home/chatLog", {
          hostUsername: params.username,
          message: "",
          username: welcomeMessage,
        });

        axios.post("/api/pusher/home/updatePlayers", {
          hostUsername: params.username,
        });
      },
    );

    homeChannel.bind(
      "pusher:subscription_error",
      // if error, redirect
      async (error: { error: string; type: string }) => {
        setAuthorized("unauthorized");
        router.push(`${process.env.NEXT_PUBLIC_DOMAIN}/error`);

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
      "pusher:member_removed",
      async (leavingPlayer: { id: string; info: PusherPresenceUserInfo }) => {
        const leavingMessage =
          ":---" + leavingPlayer.info.username + " has left!---";
        axios.post("/api/pusher/home/chatLog", {
          hostUsername: params.username,
          message: "",
          username: leavingMessage,
        });

        const resetAndDelete = async () => {
          // reset multiplayer store
          //  - the store will be emptied, but will be populated by default values if they go back to their home
          useMultiplayerStore.getState().resetData();
          const host = await getPlayerByUsername(hostUsername);
          if (!host?.data?.at(0)) return;

          await deletePlayerFromRoom({
            hostId: host.data[0]._id.toString(),
            guestId: leavingPlayer.id,
          });
        };

        axios.post("/api/pusher/home/updatePlayers", {
          hostUsername: params.username,
        });

        // if redirecting to a game, then don't clear anything because we might want to come back
        if (useGameRedirectStoreState.getState().gameRedirect) {
          useGameRedirectStoreState.setState({ gameRedirect: false });
          return;
        }

        if (leavingPlayer.id === session!.user.uid) {
          return await resetAndDelete();
        }
        // now if the host leaves, we need to kick everyone out
        if (
          leavingPlayer.info.username === hostUsername &&
          leavingPlayer.id !== session?.user.uid
        ) {
          await resetAndDelete();
          window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}`;
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

    return () => {
      useHomeStore.getState().resetData();

      homeChannel.unbind();
      pusherClient.unsubscribe(`presence-home-${hostUsername}`);
    };
  }, []);
  // #endregion

  useEffect(() => {
    if (!game) return;

    const homeChannel = pusherClient.subscribe(
      `presence-home-${params.username}`,
    );

    homeChannel.bind(
      "sceneChange",
      async ({ oldScene, newScene, targetId }: IChangeSceneParams) => {
        if (!game) return;
        if (oldScene === newScene) return;
        if (targetId && targetId !== session!.user.uid) return;

        const player = (await game.registry.get(
          "player",
        )) as Phaser.GameObjects.Sprite;
        const currSceneKey = player.scene.scene.key;

        if (oldScene == "studyroom") {
          for (let _ = 0; _ < 2; ++_) {
            // @ts-ignore
            game.scene.getScene("studyroom").cleanup();

            game.scene.switch(currSceneKey, newScene);

            setCurrScene(newScene);
          }
        } else {
          // keep these two calls of switching scenes, needed for studyroom
          game.scene.switch(currSceneKey, newScene);
          setCurrScene(newScene);
          game.scene.switch(currSceneKey, newScene);
          setCurrScene(newScene);
        }

        useMultiplayerStore
          .getState()
          .switchScene(newScene as PlayerRoomStatus);
        // const others = useMultiplayerStore.getState().otherPlayers;
        // const currNewScene = game.scene.getScene(newScene);

        // for (const other of others.values()) {
        //   curr
        // }
      },
    );
    return () => {
      homeChannel.unbind("sceneChange");
    };
  }, [gameLoaded]);
  return (
    <main>
      {authorized === "authorized" ? (
        <div>
          <div className="absolute top-0 z-0 m-0 h-full w-full p-0">
            {currentPlayer && currentPlayer.data && (
              <DynamicGame
                hostUsername={params.username}
                playerId={currentPlayer.data._id}
                playerUsername={currentPlayer.data.username}
                playerAnimalSprite={currentPlayer.data.animalSprite}
              />
            )}
          </div>
          {/* interior */}
          {currScene == "interior" && (
            <audio
              src="/music/home-everyday-motion-avbe.mp3"
              autoPlay
              loop
            ></audio>
          )}
          {/* exterior */}
          {currScene == "exterior" && (
            <audio
              src="/music/game2-floating-cat-michael-grubb.mp3"
              autoPlay
              loop
            ></audio>
          )}
          {/* studyroom */}
          <div className="absolute m-0 flex h-screen w-screen select-none items-center justify-center">
            <div
              id="studyroom_load_sprites"
              className="absolute bottom-10% z-10 flex h-3/5 w-1/2 flex-wrap justify-evenly"
            ></div>
          </div>
          {currScene == "studyroom" && (
            <div className="absolute h-screen w-screen overflow-hidden bg-black bg-[url('/backgrounds/studyroom.png')] bg-contain bg-center bg-no-repeat">
              <audio
                src="/music/studyroom-skylight-simon-folwar.mp3"
                autoPlay
                loop
              ></audio>
              <span
                className={`absolute right-20 top-10 z-10 h-20 w-16 ${isHost && "bg-[url('/objects/leave.png')] hover:bg-[url('/objects/leave_hover.png')] "} bg-right-top bg-no-repeat `}
                onClick={async () => {
                  if (!game) return;
                  if (isHost) {
                    const player = game.registry.get(
                      "player",
                    ) as Phaser.GameObjects.Sprite;
                    const currSceneKey = player.scene.scene.key;

                    await axios.post("/api/pusher/home/changeScene", {
                      channelName: `presence-home-${hostUsername}`,
                      newScene: "interior",
                      oldScene: "studyroom",
                    } as IChangeSceneParams);
                  }
                }}
              />

              <div className="w-70 z-30 mt-2% flex h-52 items-center justify-center">
                {false ? (
                  <span className="w-70 z-30"></span>
                ) : (
                  <span className="w-70 z-30">
                    <Stopwatch />
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="top-17 absolute bottom-0 right-0 z-20 ml-6 flex h-45% w-1/4 items-end justify-center p-1 text-center">
            <ChatLogPhaser
              username={
                currentPlayer?.data
                  ? currentPlayer?.data?.username
                  : "anonymous"
              }
              hostUsername={params.username}
            />
          </div>
          <div
            className="absolute bottom-0 right-7% z-40 mb-4 h-fit w-fit cursor-pointer rounded-full bg-[url(/backgrounds/whiteGrayBg.png)] bg-contain p-3 pl-4 pr-4 text-center text-4xl text-sky-700 outline-sky-800 hover:text-sky-800 hover:outline"
            onClick={() => {
              showPopup("help");
            }}
          >
            <IoMdHelp />
          </div>
          {/* nav bar */}
          <div>
            {currScene == "exterior" && isHost && (
              <div>
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
                  className="absolute inset-y-0 right-[20%] z-10 h-28 w-96 bg-[url('/objects/studyCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/studyCloudHover.png')]"
                  onClick={async () => {
                    if (!game) return;
                    const player = game.registry.get(
                      "player",
                    ) as Phaser.GameObjects.Sprite;
                    const currSceneKey = player.scene.scene.key;
                    await axios.post("/api/pusher/home/changeScene", {
                      channelName: `presence-home-${hostUsername}`,
                      newScene: "studyroom",
                      oldScene: currSceneKey,
                    } as IChangeSceneParams);
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 z-10 h-28 w-96 bg-[url('/objects/multiplayerCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/multiplayerCloudHover.png')]"
                  onClick={() => {
                    showPopup("invite");
                  }}
                />
                <div
                  className="absolute inset-y-0 left-[18%] z-10 h-28 w-96 bg-[url('/objects/mailCloud.png')] bg-right-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/mailCloudHover.png')]"
                  onClick={() => {
                    showPopup("mail");
                  }}
                />
                <div className="absolute flex w-full justify-center">
                  <div
                    className="inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/houseCloudHover.png')]"
                    onClick={async () => {
                      if (!game) return;
                      const player = game.registry.get(
                        "player",
                      ) as Phaser.GameObjects.Sprite;
                      const currSceneKey = player.scene.scene.key;
                      await axios.post("/api/pusher/home/changeScene", {
                        channelName: `presence-home-${hostUsername}`,
                        newScene: "interior",
                        oldScene: currSceneKey,
                      } as IChangeSceneParams);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {!isHost && gameLoaded && (
            <div className="absolute flex w-full justify-start">
              <div
                className="inset-y-0 z-10 h-28 w-96 bg-[url('/objects/houseCloud.png')] bg-left-top bg-no-repeat hover:z-20 hover:cursor-pointer hover:bg-[url('/objects/leaveCloud.png')]"
                onClick={async () => {
                  if (!game) return;

                  window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN}`;
                }}
              />
            </div>
          )}
          {showInvitePopup && (
            <div className="flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-white"
                ref={inviteRef}
              >
                <InvitePopup
                  hostId={session!.user.uid}
                  hostUsername={params.username}
                  isHost={isHost}
                />
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
          {showEaselPopup && (
            <div className="flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-slate-200"
                ref={mailRef}
              >
                <EaselPopup />
              </div>
            </div>
          )}
          {showHelpPopup && (
            <div className="z-50 flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-slate-200"
                ref={mailRef}
              >
                <HelpPopup defaultTab="About" />
              </div>
            </div>
          )}
          {showGameMenu && (
            <div className="flex h-screen w-screen items-center justify-center">
              <div
                className="flex items-center justify-center bg-white"
                ref={inviteRef}
              >
                <GamePopup
                  hostId={session!.user.uid}
                  hostUsername={params.username}
                  isHost={isHost}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex h-screen w-screen items-center justify-center bg-[url(/backgrounds/greenBg.png)] bg-cover bg-no-repeat">
            <div className="h-fit w-fit rounded-full bg-[url(/backgrounds/pinkBigBg.png)] outline-dashed outline-4 outline-white">
              <p className="animate-bounce p-16 pb-5 pl-20 pr-20 text-8xl text-white">
                Verifying...
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
