export interface ICustomError {
    message: string;
    code: CustomErrorCode;
}

export enum CustomErrorCode {
    DUPLICATE_TABS="duplicate-tabs",
    HOST_NOT_FOUND="host-not-found",
    HOST_NOT_ONLINE="host-not-online",
    HOST_ROOM_NOT_FOUND="host-room-not-found",
    HOST_ROOM_FULL="host-room-full",
    HOST_IN_GAME="host-in-game",
    PLAYER_NOT_AUTHENTICATED="player-not-authenticated",
    PLAYER_NOT_FOUND="player-not-found",
    PLAYER_NOT_WHITELISTED="player-not-whitelisted"
}