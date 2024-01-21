import mongoose, { Error, Types, mongo } from "mongoose";
import {
  prop,
  pre,
  getModelForClass,
  queryMethod,
  modelOptions,
} from "@typegoose/typegoose";
import type { types, Ref as TypeRef } from "@typegoose/typegoose";
import { UserSchema } from "@/services/lucia/models";
import { ModelWithQueryHelpers } from "./types";
import { AnimalSprite } from "@/types";

const MAX_MAIL = 8;
const MAX_INBOX_CHARS = 400;

@pre<Mail>("save", function (next) {
  if (this.content.length > MAX_INBOX_CHARS) {
    const err = new mongoose.Error(`Content exceeded ${MAX_INBOX_CHARS} character limit.`);
    throw(err);
  }

  next();
})
@modelOptions({ schemaOptions: { _id: false } })
class Mail {
  @prop({ required: true, ref: () => Player, type: () => String })
  public senderId!: TypeRef<Player, string>;

  @prop({ required: true, ref: () => Player, type: () => String })
  public recieverId!: TypeRef<Player, string>;

  @prop({ required: true })
  public content!: string;
}

// QUERY HELPERS
interface PlayerQueryHelpers {
  findByUsername: types.AsQueryMethod<typeof findByUsername>;
}
function findByUsername(
  this: types.QueryHelperThis<typeof Player, PlayerQueryHelpers>,
  username: Player["username"],
) {
  return this.find({ username });
}

@pre<Player>("save", function (next) {
  if (this.inbox.length > MAX_MAIL) {
    const err = new mongoose.Error(`This player has too much mail!`);
    throw (err);
  }

  next();
})
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

  @prop({ required: true, type: Mail, default: [] })
  public inbox!: Mail[];
}

export const PlayerModel: ModelWithQueryHelpers<
  typeof Player,
  PlayerQueryHelpers
> =
  (mongoose.models.Player as ModelWithQueryHelpers<
    typeof Player,
    PlayerQueryHelpers
  >) || getModelForClass<typeof Player, PlayerQueryHelpers>(Player);

export type NewPlayerInput = Omit<Player, "currentPlayerRoomId" | "inbox">;
