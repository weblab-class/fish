import { PlayerRoomStatus } from "@/types";
import { MAX_SENTENCE_SYMPHONY_PLAYERS, MIN_SENTENCE_SYMPHONY_PLAYERS } from "./consts";

export function getDefaultPosition(room: PlayerRoomStatus) {
  switch (room) {
    case PlayerRoomStatus.EXTERIOR:
      return { x: 700, y: 650 };
    case PlayerRoomStatus.INTERIOR:
      return {
        x: 725,
        y: 830,
      };
    // for these rooms, there is no movement to keep track of
    case PlayerRoomStatus.STUDY:
    case PlayerRoomStatus.SENTENCE_SYMPHONY:
      return {
        x: -100,
        y: -100,
      };
  }
}

export const getGames = (username: string) => ([
  {
    game: "✏️ Sentence Symphony",
    desc: "Test how great of an author you are in this blend of grammar, ideas, and AI.",
    requirements: `Requires ${MIN_SENTENCE_SYMPHONY_PLAYERS} to ${MAX_SENTENCE_SYMPHONY_PLAYERS} players.`,
    redirectLink: `${process.env.NEXT_PUBLIC_DOMAIN}/game/${username}`
  },
]);