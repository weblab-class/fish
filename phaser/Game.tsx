import { Game as PhaserGame } from "phaser";
import { useEffect, useRef, useState } from "react";
import {
  // PlayerRoomUserInfo,
  // PusherError,
  pusherClient,
} from "../services/pusher";
// import { PlayerInfo } from "./types";
import axios from "axios";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { useGameStore } from "../stores/gameStore";
import { Session } from "lucia";
import { useLuciaSession } from "../services/lucia/LuciaSessionProvider";
import exterior from "./exterior";
import interior from "./interior";
import studyroom from "./studyroom";
import { useGetPlayer } from "@/services/react-query";

interface IRedirectStoreState {
  redirect: boolean;
  setRedirect: (state: boolean) => void;
}

const useRedirectStore = create<IRedirectStoreState>((set) => ({
  redirect: false,
  setRedirect: (state) => set({ redirect: state }),
}));

export default function Game() {
  const [inviteScreen, setInviteScreen] = useState(false);
  const parentEl = useRef<HTMLDivElement>(null);
  let [game, setGame] = useState<PhaserGame | null>(null);
  const [redirect] = useRedirectStore((state) => [state.redirect]);
  const { session } = useLuciaSession();
  const uid = session!.user.uid;
  const router = useRouter();
  const [scenes, text, showInvitePopup, showMailPopup, showPopup, setDefault, setData] = useGameStore(
    (state) => [
      state.scenes,
      state.text,
      state.showInvitePopup,
      state.showMailPopup,
      state.showPopup,
      state.setDefault,
      state.setData,
    ],
  );
  const { data: player } = useGetPlayer(uid);

  // TODO fix how it only works right when you finish build it
  useEffect(() => {
    if (redirect) {
      router.push("/no-duplicate-tabs");
    }
  }, [redirect]);

  useEffect(() => {
    if (!parentEl.current) return;

    // get presence-channel for room
    // const channel = pusherClient.subscribe(`presence-host-${uid}`);

    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: "phaser-container",
      width: 2000,
      height: 3000,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      scene: scenes,
      dom: {
        createContainer: true
      },
    };

    console.log(gameConfig);

    game?.destroy(true);

    const newGame = new PhaserGame({
      ...gameConfig,
      parent: parentEl.current,
      width: parentEl.current.offsetWidth,
      height: parentEl.current.offsetHeight,
    });

    setGame(newGame);
    setData({ game: newGame });

    // return () => {
    //   pusherClient.unsubscribe(`presence-host-${uid}`);
    //   channel.unbind(); // unsubscribe when the component unmounts
    //   newGame?.destroy(true, true);
    // };
  }, [scenes]);

  // add other players to current player's screen
  // function addOtherPlayer(scene: Phaser.Scene, playerInfo: PlayerInfo) {
  //   const otherPlayer = scene.add.sprite(playerInfo.x, playerInfo.y, "cow");
  //   otherPlayer.setDataEnabled();
  //   otherPlayer.data.set("playerId", playerInfo.playerId);

  //   (scene.data.get("otherPlayers") as Phaser.GameObjects.Group).add(
  //     otherPlayer,
  //   );
  // }

  return (
    <div className="absolute">
      <div ref={parentEl} className="phaser-container block h-full w-full" />
      <div className="absolute bottom-7 flex w-full justify-center">
        { text !== "" && (
          <div className="rounded-xl bg-opacity-90 z-50 bg-[url('/backgrounds/pinkBg.png')] bg-cover p-4 text-center text-2xl text-white shadow-md shadow-pink-900 outline outline-white">
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
