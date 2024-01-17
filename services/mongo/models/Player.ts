import mongoose, { model, Schema, Types } from "mongoose";

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
    ref: "User",
    required: true,
  }, // tracks what room they are in (on creation, this will be the uid from next-auth/mongodb)
  teamId: { type: Schema.Types.ObjectId, ref: "Team" },
});
playerSchema.pre("save", function (next) {
  if (this.isNew) {
    // if new, set the document _id to the uid
    this._id = this.currentPlayerRoomId;
  }
  next();
});

export const PlayerModel: mongoose.Model<IPlayer> =
  mongoose.models.Player || model<IPlayer>("Player", playerSchema);
