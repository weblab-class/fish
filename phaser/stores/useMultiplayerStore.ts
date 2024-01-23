import { create } from "zustand";

import { AnimalSprite, PlayerRoomStatus } from "@/types";
import { StoreStateFunc } from "./types";
import { PlayerInfo } from "../types";
import { getDefaultPosition } from "@/phaser/settings/functions";

// PLAYER DATA
const getDefaultPlayerInfo = (
  uid: string,
  username: string,
  sprite: AnimalSprite,
  roomStatus: PlayerRoomStatus,
) => {
  const pos: Pick<PlayerInfo, "roomStatus" | "x" | "y"> = { roomStatus, ...getDefaultPosition(roomStatus)};
  return { uid, username, sprite, ...pos } as PlayerInfo;
};

// STORE DATA
type MultiplayerStoreStateData = {
  currentPlayer: PlayerInfo | null;
  otherPlayers: Map<PlayerInfo["uid"], PlayerInfo>;
};
const getDefaultMuliplayerStoreStateData = () =>
  ({
    currentPlayer: null,
    otherPlayers: new Map(),
  }) as MultiplayerStoreStateData;

// STORE TYPES
type MultiplayerStoreStateFunc = {
  /** This also updates the current player. */
  getPosition: () => {x: number, y: number} | null;
  sendMyData: (playerSprite: Phaser.GameObjects.Sprite) => Promise<void>;
  initCurrent: (uid: string, username: string, sprite: AnimalSprite) => void;
  addOrUpdateOther: (playerInfo: PlayerInfo) => void;
  deleteOther: (uid: PlayerInfo["uid"]) => void;
};
type MultiplayerStoreState = MultiplayerStoreStateData &
  MultiplayerStoreStateFunc &
  StoreStateFunc<MultiplayerStoreStateData>;

/**
 * Used to keep track of multiplayer data globally (client-side).
 * **NOTE: This is independent of Phaser, so feel free to use it somewhere else.**
 */
export const useMultiplayerStore = create<MultiplayerStoreState>((set, get) => ({
  ...getDefaultMuliplayerStoreStateData(),
  getPosition: () => {
    const curr = get().currentPlayer;
    return curr ? { x: curr.x, y: curr.y } : null;
  },
  sendMyData: async (playerSprite) => {
    const { x: newX, y: newY } = playerSprite.body!.position;
    const roomStatus = playerSprite.scene.scene.key as PlayerRoomStatus;

    set((state) => {
      if (state.currentPlayer)
        return {
          currentPlayer: {
            ...state.currentPlayer,
            x: newX,
            y: newY,
            roomStatus,
          },
        };

      throw Error("You must initalize before sending your data!");
    });

    // TODO: axios post to notify others to add your data via addOrUpdateOther()
  },
  initCurrent: (uid, username, sprite) =>
    set({
      currentPlayer: getDefaultPlayerInfo(
        uid,
        username,
        sprite,
        PlayerRoomStatus.EXTERIOR,
      ),
    }),
  addOrUpdateOther: (playerInfo) => {
    const newOthers = get().otherPlayers.set(playerInfo.uid, playerInfo);

    set({ otherPlayers: newOthers });
  },
  deleteOther: (uid) => {},
  setData: (data) => set({ ...data }),
  resetData: () => set({ ...getDefaultMuliplayerStoreStateData() }),
}));
