import { create } from "zustand";

type PopupType = "invite" | "mail";

type GameStoreStateData = {
    showInvitePopup: boolean;
    showMailPopup: boolean;

}
const getDefaultGameStoreStateData = () => ({
    showInvitePopup: false,
    showMailPopup: false,
} as GameStoreStateData);

type GameStoreStateFunc = {
    setDefault: () => void;
    showPopup: (popup: PopupType) => void;
}

type StoreStateFunc<T extends object> = {
    setData: (data: T) => void;
}

type GameStoreState = GameStoreStateData & GameStoreStateFunc & StoreStateFunc<GameStoreStateData>;

export const useGameStore = create<GameStoreState>((set) => ({
    ...getDefaultGameStoreStateData(),
    setData: (data) => set({...data}),
    setDefault: () => set({...getDefaultGameStoreStateData()}),
    showPopup: (popup) => {
        const data = getDefaultGameStoreStateData();
        switch (popup) {
            case "invite":
                data.showInvitePopup = true;
                break;
            case "mail":
                data.showMailPopup = true;
                break;
        }
        console.log(data);
        set({...data});
    }
}));
