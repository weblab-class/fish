import { create } from "zustand";

import { AnimalSprite, PlayerRoomStatus } from "@/types";
import { StoreStateFunc } from "./types";
import {
  IChangeSceneParams,
  ISendPlayerDataParams,
  PlayerInfo,
} from "../types";
import { getDefaultPosition } from "@/phaser/settings/functions";
import axios, { AxiosResponse } from "axios";

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
    scene: PlayerRoomStatus,
  ) => (() => Promise<void>) | void;
  switchScene: (newScene: PlayerRoomStatus) => void;
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

      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/home/sendPlayerData`,
        {
          channelName: `presence-home-${get().hostUsername}`,
          senderData: get().currentPlayer!,
          targetId: targetId ?? null,
        } as ISendPlayerDataParams,
      );
    },
    initCurrent: (uid, username, sprite, phaserSprite, hostUsername, scene) => {
      const defaultPlayerInfo = getDefaultPlayerInfo(
        uid,
        username,
        sprite,
        scene,
      );

      set({
        hostUsername,
        currentPlayerPhaserSprite: phaserSprite,
        currentPlayer: defaultPlayerInfo,
      });

      phaserSprite.setPosition(defaultPlayerInfo.x, defaultPlayerInfo.y);

      const host = Array.from(get().otherPlayers.values())
        .filter(({ username }) => hostUsername === username)
        .at(0);
      console.log("host", host);
      if (host && host.roomStatus !== defaultPlayerInfo.roomStatus) {
        return async () => {
          await axios.post("/api/pusher/home/changeScene", {
            channelName: `presence-home-${hostUsername}`,
            newScene: host.roomStatus,
            oldScene: "exterior",
            targetId: uid,
          } as IChangeSceneParams);
        };
      }
    },
    switchScene: (newScene) => {
      const { x, y } = getDefaultPosition(newScene);

      const others = get().otherPlayers;
      for (const otherInfo of Array.from(others.values())) {
        otherInfo.x = x;
        otherInfo.y = y;
        otherInfo.roomStatus = newScene;
      }

      const curr = get().currentPlayer;
      if (!curr) {
        throw new Error("There has to be a player!");
      }
      curr.x = x;
      curr.y = y;
      curr.roomStatus = newScene;

      set({ currentPlayer: curr, otherPlayers: others });
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
