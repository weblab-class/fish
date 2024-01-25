import { create } from "zustand";

import type { StoreStateFunc } from "./types";

type PopupType = "invite" | "mail";

type HomeStoreStateData = {
  game: Phaser.Game | null;
  showClouds: boolean;
  showInvitePopup: boolean;
  showMailPopup: boolean;
  text: string;
};
const getDefaultHomeStoreStateData = () =>
  ({
    game: null,
    showClouds: true,
    showInvitePopup: false,
    showMailPopup: false,
    text: "",
  }) as HomeStoreStateData;

type HomeStoreStateFunc = {
  setDefault: () => void;
  showPopup: (popup: PopupType) => void;
  setCloudVisbility: (visibility: boolean) => void;
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
  setDefault: () => set({ showClouds: true, showInvitePopup: false, showMailPopup: false }),
  showPopup: (popup) => {
    const data = getDefaultHomeStoreStateData();
    switch (popup) {
      case "invite":
        data.showInvitePopup = true;
        break;
      case "mail":
        data.showMailPopup = true;
        break;
    }
    set({ ...data });
  },
  setCloudVisbility: (visbility) => {
    if (visbility) {
      return set({ showClouds: true })
    }

    set({ showClouds: false, showInvitePopup: false, showMailPopup: false })
  },
  resetData: () => ({ ...getDefaultHomeStoreStateData() }),
}));
