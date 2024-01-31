import { PlayerInfo } from ".";

export interface ISendPlayerDataParams {
    channelName: string;
    senderData: PlayerInfo;
    targetId: string | null;
}