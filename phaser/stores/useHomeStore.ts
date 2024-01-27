import { create } from "zustand";

import type { StoreStateFunc } from "./types";

type PopupType = "invite" | "mail"|"easel";

type HomeStoreStateData = {
  game: Phaser.Game | null;
  hostUsername: string;
  showInvitePopup: boolean;
  showMailPopup: boolean;
  showEaselPopup:boolean;
  text: string;
};
const getDefaultHomeStoreStateData = () =>
  ({
    game: null,
    hostUsername: "Host",
    showInvitePopup: false,
    showMailPopup: false,
    showEaselPopup:false,
    text: "",
  }) as HomeStoreStateData;

type HomeStoreStateFunc = {
  setDefault: () => void;
  showPopup: (popup: PopupType) => void;
};

type HomeStoreState = HomeStoreStateData &
  HomeStoreStateFunc &
  StoreStateFunc<HomeStoreStateData>;

/**
 * Global store for interacting between HTML components and Phaser.
 */
export const useHomeStore = create<HomeStoreState>((set) => ({
  ...getDefaultHomeStoreStateData(),
  setData: (data) => set({ ...data }),
  setDefault: () => set({ ...getDefaultHomeStoreStateData() }),
  showPopup: (popup) => {
    const data = getDefaultHomeStoreStateData();
    switch (popup) {
      case "invite":
        data.showInvitePopup = true;
        break;
      case "mail":
        data.showMailPopup = true;
        break;
        case "easel":
          data.showEaselPopup = true;
          break;
    }
    set({ ...data });
  },
  resetData: () => ({ ...getDefaultHomeStoreStateData() }),
}));
