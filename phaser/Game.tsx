"use client";

import { useEffect, useRef } from "react";
import { Game as PhaserGame } from "phaser";

import { useHomeStore } from "./stores";
import exterior from "./scenes/exterior";
import interior from "./scenes/interior";
import studyroom from "./scenes/studyroom";
import { Player } from "@/services/mongo/models";

interface IGameProps {
  hostUsername: string;
  playerId: Player["_id"];
  playerUsername: Player["username"];
  playerAnimalSprite: Player["animalSprite"];
}

/**
 * The Phaser container for the home route.
 */
export default function Game({
  hostUsername,
  playerId,
  playerUsername,
  playerAnimalSprite,
}: IGameProps) {
  const parentEl = useRef<HTMLDivElement>(null);
  const [text, setData] = useHomeStore((state) => [state.text, state.setData]);
  useEffect(() => {
    console.log("starting game");
  }, []);

  useEffect(() => {
    if (!parentEl.current) return;

    console.log("gameconfig");
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      parent: "phaser-container",
      width: 2000,
      height: 3000,
      backgroundColor: "#000000",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [
        new exterior(
          hostUsername,
          playerId.toString(),
          playerUsername,
          playerAnimalSprite,
        ),
        interior,
        new studyroom(hostUsername),
      ],
      dom: {
        createContainer: true,
      },
    };

    const game = new PhaserGame({
      ...gameConfig,
      parent: parentEl.current,
      width: parentEl.current.offsetWidth,
      height: parentEl.current.offsetHeight,
    });

    setData({ game });

    return () => {
      setData({ game: null });
      game?.destroy(true, true);
    };
  }, [parentEl]);

  return (
    <div className="absolute">
      <div ref={parentEl} className="phaser-container block h-full w-full" />
      <div className="absolute bottom-7 flex w-full justify-center">
        {text !== "" && (
          <div className="z-50 rounded-xl bg-opacity-90 bg-[url('/backgrounds/pinkBg.png')] bg-cover p-4 text-center text-2xl text-white shadow-md shadow-pink-900 outline outline-white">
            {text}
          </div>
        )}
      </div>
    </div>
  );
}
