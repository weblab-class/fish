import mongoose, { Types } from "mongoose";
import {
  getDiscriminatorModelForClass,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import type { Ref as TypeRef } from "@typegoose/typegoose";

import { GameRoomModel, GameRoom } from "./BaseGameRoom";
import { Player } from "..";
import { GameRoomType } from "@/types";
import { PlayerInfo } from "@/phaser/types";

@pre<SentenceSymphonyGameRoom>("save", function (next) {
  if (this.allPlayers.length > 6) {
    const err = new mongoose.Error("The game is full.");
    throw err;
  }

  next();
})
@modelOptions({ options: { customName: "SentenceSymphony" } })
export class SentenceSymphonyGameRoom extends GameRoom {
  @prop({ required: true })
  public initialPrompt!: string;

  @prop({ required: true, type: () => SSVoteOption, default: [] })
  public voteOptions!: SSVoteOption[];

  @prop({ required: true, type: () => SSScore, default: [] })
  public scores!: SSScore[];

  @prop({ required: true, type: () => SSSentence, default: [] })
  public sentences!: SSSentence[];
}

@modelOptions({ schemaOptions: { _id: false } })
export class SSVoteOption {
  @prop({ required: true })
  public sentence!: string;

  @prop({ required: true, ref: () => Player, type: () => String })
  public creatorId!: TypeRef<Player, string>;

  @prop({ required: true, ref: () => Player, type: () => String, default: [] })
  public voteIds!: TypeRef<Player, string>[]; // this means the ids of the players who voted
}

@modelOptions({ schemaOptions: { _id: false } })
export class SSScore {
  @prop({ required: true, ref: () => Player, type: () => String })
  public playerId!: TypeRef<Player, string>;

  @prop({ required: true, default: 0 })
  public score!: number;
}

@modelOptions({ schemaOptions: { _id: false } })
export class SSSentence {
  @prop({ required: true })
  public sentence!: string;

  @prop({ required: true, ref: () => Player, type: () => String })
  public creatorId!: TypeRef<Player, string>;
}

export const SentenceSymphonyGameRoomModel =
  mongoose.models.SentenceSymphony ||
  getDiscriminatorModelForClass(
    GameRoomModel,
    SentenceSymphonyGameRoom,
    GameRoomType.SENTENCE_SYMPHONY,
  );

export interface NewSentenceSymphonyGameRoomInput {
  hostInfo: PlayerInfo;
  otherPlayerInfo: PlayerInfo[],
  initialPrompt: string;
}

export type UpdateSentenceSymphonyGameRoomInput = {hostId: SentenceSymphonyGameRoom["hostId"]} & Partial<Omit<SentenceSymphonyGameRoom, "hostId">>
