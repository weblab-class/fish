import mongoose, { Error, model, Schema, Types } from "mongoose";
import { pre, type Ref as TypeRef } from "@typegoose/typegoose";
import { Player } from "..";
import { getModelForClass, modelOptions, prop, } from "@typegoose/typegoose";

const MAX_PLAYERS = 6;

export enum GameRoomType {
  SENTENCE_SYMPHONY = "sentence-symphony",
}

@pre<GameRoom>("save", function (next) {
  if (this.allPlayers.length > MAX_PLAYERS) {
    const err = new Error("The game is full.");
    next(err);
  }
})
@modelOptions({ schemaOptions: { collection: "gamerooms" } })
export class GameRoom {
  @prop({ required: true, ref: () => Player, type: () => String })
  public _id!: TypeRef<Player, string>;  // NOTE: This is host ID.

  @prop({ required: true, ref: () => Player, type: () => String})
  public hostId!: TypeRef<Player, string>;

  @prop({ required: true, type: () => GamePlayerInfo, default: []})
  public allPlayers!: Types.Array<GamePlayerInfo>;
}

@modelOptions({ schemaOptions: { _id: false }})
class GamePlayerInfo {
  @prop({ required: true, ref: () => Player, type: () => String})
  public playerId!: TypeRef<Player, string>;

  @prop({ required: true })  // should default to player's username in API route
  public gameName!: string;
}

export const GameRoomModel: mongoose.Model<GameRoom> = mongoose.models.GameRoom || getModelForClass(GameRoom);





