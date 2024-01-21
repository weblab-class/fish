import {
  getModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import mongoose, { model, Schema, Types, Error } from "mongoose";
import type { Ref as TypeRef } from "@typegoose/typegoose";
import { Player } from "./Player";

const MAX_PLAYERS = 6;

@modelOptions({ schemaOptions: { _id: false } })
export class PlayerData {
  @prop({ required: true, ref: () => Player, type: () => String })
  public playerId!: TypeRef<Player, string>;

  @prop({ required: true })
  public x!: number;

  @prop({ required: true })
  public y!: number;
}

export enum PlayerRoomStatus {
  EXTERIOR = "exterior",
  INTERIOR = "interior",
  STUDY = "studyroom",
}

@pre<PlayerRoom>("save", function (next) {
  if (this.allPlayers.length > MAX_PLAYERS) {
    const err = new mongoose.Error(
      `You cannot have more than ${MAX_PLAYERS} players.`,
    );
    throw err;
  }

  next();
})
export class PlayerRoom {
  @prop({ required: true, ref: () => Player, type: () => String })
  public _id!: TypeRef<Player, string>; // NOTE: This is host ID.

  @prop({ required: true, ref: () => Player, type: () => String })
  public hostId!: TypeRef<Player, string>;

  @prop({ required: true, enum: () => PlayerRoomStatus })
  public hostStatus!: PlayerRoomStatus;

  @prop({ required: true, type: PlayerData, default: [] })
  public allPlayers!: PlayerData[]; // NOTE: This includes host.
}

export const PlayerRoomModel: mongoose.Model<PlayerRoom> =
  mongoose.models.PlayerRoom || getModelForClass(PlayerRoom);

export type PlayerRoomInput = Omit<
  PlayerRoom,
  "_id" | "hostStatus" | "allPlayers"
>;
