import mongoose, { InferSchemaType, model, Schema, Types } from "mongoose";
import { mongooseConnect } from "../mongoose";

export enum AnimalSpriteType {
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

interface IPlayer {
  _id: string;
  username: string;
  animalSprite: AnimalSpriteType;
  currentPlayerRoomId: Types.ObjectId;
  teamId?: Types.ObjectId;
}

const playerSchema = new Schema<IPlayer>({
  username: { type: String, required: true, index: { unique: true } },
  animalSprite: { type: String, enum: AnimalSpriteType, required: true },
  currentPlayerRoomId: {
    type: Schema.Types.ObjectId,
    ref: "player",
    required: true,
  }, // tracks what room they are in
  teamId: { type: Schema.Types.ObjectId, ref: "team" },
});

export const PlayerModel: mongoose.Model<IPlayer> = mongoose.models.Player || model<IPlayer>("Player", playerSchema);
