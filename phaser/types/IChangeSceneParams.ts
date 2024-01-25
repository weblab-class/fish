import { PlayerRoomStatus } from "@/types"

export interface IChangeSceneParams {
    from: PlayerRoomStatus;
    to: PlayerRoomStatus;
}