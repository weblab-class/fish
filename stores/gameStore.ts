import { create } from "zustand";
import exterior from "../phaser/exterior";
import interior from "../phaser/interior";
import studyroom from "../phaser/studyroom";

type PopupType = "invite" | "mail";

type GameStoreStateData = {
    game: Phaser.Game | null;
    scenes: Phaser.Types.Scenes.SceneType[],
    hostUsername: string;
    showInvitePopup: boolean;
    showMailPopup: boolean;
    text: string;
}
const getDefaultGameStoreStateData = () => ({
    game: null,
    scenes: [exterior, interior, studyroom],
    hostUsername: "Host", 
    showInvitePopup: false,
    showMailPopup: false,
    text: "",
} as GameStoreStateData);

type GameStoreStateFunc = {
    setDefault: () => void;
    showPopup: (popup: PopupType) => void;
}

type StoreStateFunc<T extends object> = {
    setData: (data: Partial<T>) => void;
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
        set({...data});
    }
}));
