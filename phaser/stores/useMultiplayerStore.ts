import { create } from "zustand";

import { AnimalSprite, PlayerRoomStatus } from "@/types";
import { StoreStateFunc } from "./types";
import { ISendDataParams, PlayerInfo } from "../types";
import { getDefaultPosition } from "@/phaser/settings/functions";
import axios from "axios";

// PLAYER DATA
const getDefaultPlayerInfo = (
  uid: string,
  username: string,
  sprite: AnimalSprite,
  roomStatus: PlayerRoomStatus,
) => {
  const pos: Pick<PlayerInfo, "roomStatus" | "x" | "y"> = {
    roomStatus,
    ...getDefaultPosition(roomStatus),
  };
  return { uid, username, sprite, ...pos } as PlayerInfo;
};

// STORE DATA
type MultiplayerStoreStateData = {
  hostUsername: string | null;
  currentPlayerPhaserSprite: Phaser.GameObjects.Sprite | null;
  currentPlayer: PlayerInfo | null;
  otherPlayers: Map<PlayerInfo["uid"], PlayerInfo>;
};
const getDefaultMuliplayerStoreStateData = () =>
  ({
    hostUsername: null,
    currentPlayerPhaserSprite: null,
    currentPlayer: null,
    otherPlayers: new Map(),
  }) as MultiplayerStoreStateData;

// STORE TYPES
type MultiplayerStoreStateFunc = {
  /** This also updates the current player. */
  getPosition: () => { x: number; y: number } | null;
  sendMyData: ({ to }: { to?: string }) => Promise<void>;
  initCurrent: (
    uid: string,
    username: string,
    sprite: AnimalSprite,
    phaserSprite: Phaser.GameObjects.Sprite,
    hostUsername: string,
  ) => void;
  addOrUpdateOther: (playerInfo: PlayerInfo) => void;
  /** NOTE: Does not delete the sprite out of the screen. Also, does not  */
  deleteOther: (uid: PlayerInfo["uid"]) => void;
};
type MultiplayerStoreState = MultiplayerStoreStateData &
  MultiplayerStoreStateFunc &
  StoreStateFunc<MultiplayerStoreStateData>;

/**
 * Used to keep track of multiplayer data globally (client-side).
 * **NOTE: This is independent of Phaser, so feel free to use it somewhere else.**
 */
export const useMultiplayerStore = create<MultiplayerStoreState>(
  (set, get) => ({
    ...getDefaultMuliplayerStoreStateData(),
    getPosition: () => {
      const curr = get().currentPlayer;
      return curr ? { x: curr.x, y: curr.y } : null;
    },
    sendMyData: async ({ to: targetId }) => {
      const playerSprite = get().currentPlayerPhaserSprite;
      if (!playerSprite)
        throw new Error("You must initalize before sending your data!");

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

        throw new Error("You must initalize before sending your data!");
      });

      // TODO: axios post to notify others to add your data via addOrUpdateOther()
      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/home/sendData`,
        {
          channelName: `presence-home-${get().hostUsername}`,
          senderData: get().currentPlayer!,
          targetId: targetId ?? null,
        } as ISendDataParams,
      );
    },
    initCurrent: (uid, username, sprite, phaserSprite, hostUsername) => {
      const defaultPlayerInfo = getDefaultPlayerInfo(
        uid,
        username,
        sprite,
        PlayerRoomStatus.EXTERIOR,
      );

      set({
        hostUsername,
        currentPlayerPhaserSprite: phaserSprite,
        currentPlayer: defaultPlayerInfo,
      });

      phaserSprite.setPosition(defaultPlayerInfo.x, defaultPlayerInfo.y);
      
    },
    addOrUpdateOther: (playerInfo) => {
      get().otherPlayers.set(playerInfo.uid, playerInfo);

      set({ otherPlayers: get().otherPlayers });
    },
    deleteOther: (uid) => {
      get().otherPlayers.delete(uid);

      set({ otherPlayers: get().otherPlayers });
    },
    setData: (data) => set({ ...data }),
    resetData: () => set({ ...getDefaultMuliplayerStoreStateData() }),
  }),
);
