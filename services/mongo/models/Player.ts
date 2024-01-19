import mongoose from "mongoose";
import { prop, pre, getModelForClass } from "@typegoose/typegoose";
import type { Ref as TypeRef } from "@typegoose/typegoose";
import { UserSchema } from "@/services/lucia/models";

export enum AnimalSprite {
  COW = "cow",
  BEAR = "bear",
  BEAVER = "beaver",
  BUNNY = "bunny",
  CAT = "cat",
  DUCK = "duck",
  HEDGEHOG = "hedgehog",
  PANDA = "panda",
  PENGUIN = "penguin",
  PIG = "pig",
  SHEEP = "sheep",
  SHIBA = "shiba",
}

@pre<Player>("save", function () {
  if (this.isNew) {
    this.currentPlayerRoomId = this._id;
  }
})
export class Player {
  @prop({ required: true, ref: () => UserSchema, type: () => String })
  public _id!: TypeRef<UserSchema, string>;

  @prop({ required: true, index: 1, unique: true })
  public username!: string;

  @prop({ required: true, enum: () => AnimalSprite })
  public animalSprite!: AnimalSprite;

  @prop({ default: "", ref: () => UserSchema, type: () => String })
  public currentPlayerRoomId?: TypeRef<UserSchema, string>;

  // add team (optional)
}

export const PlayerModel: mongoose.Model<Player> =
  mongoose.models.Player || getModelForClass(Player);
  
export type NewPlayerInput = Omit<Player, "currentPlayerRoomId">;


