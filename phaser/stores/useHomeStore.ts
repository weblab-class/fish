import { create } from "zustand";

import type { StoreStateFunc } from "./types";

type PopupType = "invite" | "mail" | "easel" |"help";

type HomeStoreStateData = {
  game: Phaser.Game | null;
  hostUsername: string;
  showInvitePopup: boolean;
  showMailPopup: boolean;
  showEaselPopup: boolean;
  showHelpPopup:boolean;
  text: string;
};
const getDefaultHomeStoreStateData = (keepGame: boolean = true) => {
  if (keepGame) {
    return {
      hostUsername: "Host",
      showInvitePopup: false,
      showMailPopup: false,
      showEaselPopup: false,
      showHelpPopup:false,
      text: "",
    } as HomeStoreStateData;
  }

  return {
    game: null,
    hostUsername: "Host",
    showInvitePopup: false,
    showMailPopup: false,
    showEaselPopup: false,
    showHelpPopup:false,
    text: "",
  } as HomeStoreStateData;
};

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
  /** Keep the game. If you need to remove the game, then specify using setData. */
  setDefault: () => set((state) => ({ ...getDefaultHomeStoreStateData() })),
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
        case "help":
        data.showHelpPopup = true;
        break;
    }
    set({ ...data });
  },
  resetData: () => ({ ...getDefaultHomeStoreStateData(false) }),
}));
