import { PlayerInfo } from ".";

export interface ISendDataParams {
    channelName: string;
    senderData: PlayerInfo;
    targetId: string | null;
}