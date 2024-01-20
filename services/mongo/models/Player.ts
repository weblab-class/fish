import mongoose, { Error, Types, mongo } from "mongoose";
import { prop, pre, getModelForClass, queryMethod } from "@typegoose/typegoose";
import type { types, Ref as TypeRef } from "@typegoose/typegoose";
import { UserSchema } from "@/services/lucia/models";
import { Mail } from ".";

const MAX_MAIL = 8;

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
export type AnimalSpriteType = `${AnimalSprite}`;

// QUERY HELPERS
interface PlayerQueryHelpers {
  findByUsername: types.AsQueryMethod<typeof findByUsername>;
}
function findByUsername(this: types.QueryHelperThis<typeof Player, PlayerQueryHelpers>, username: Player["username"]) {
  return this.find({ username });
}

// @pre<Player>("save", function (next) {
//   if (this.inbox.length > MAX_MAIL) {
//     const err = new Error(`This player has too much mail!`);
//     next(err);
//   }
// })
@queryMethod(findByUsername)
export class Player {
  @prop({ required: true, ref: () => UserSchema, type: () => String })
  public _id!: TypeRef<UserSchema, string>;

  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true, enum: () => AnimalSprite })
  public animalSprite!: AnimalSprite;

  @prop({ required: true, ref: () => UserSchema, type: () => String })
  public currentPlayerRoomId!: TypeRef<UserSchema, string>;

  // @prop({ required: true, type: () => Mail, default: [] })
  // public inbox!: Types.Array<Mail>;
}

export const PlayerModel: mongoose.Model<Player> =
  mongoose.models.Player || getModelForClass(Player);

export type NewPlayerInput = Omit<Player, "currentPlayerRoomId" | "inbox">;
