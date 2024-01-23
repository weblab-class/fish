import type { AnimalSprite, PlayerRoomStatus } from "@/types";

export type PlayerInfo = {
    uid: string;
    username: string;
    sprite: AnimalSprite;
    x: number;
    y: number;
    roomStatus: PlayerRoomStatus;
  };