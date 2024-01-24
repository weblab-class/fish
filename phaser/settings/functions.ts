import { PlayerRoomStatus } from "@/types";

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
