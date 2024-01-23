import { AnimalSprite } from "@/types";

// NOTE: Does not include x and y because it's always changing. These values are consistent across all Phaser scenes.
export type PusherPresenceUserInfo = {
    uid: string;
    socket_id: string;
    username: string;
    sprite: AnimalSprite;
}