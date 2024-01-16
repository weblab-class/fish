import mongoose, { model, Schema, Types } from "mongoose";

export enum PlayerRoomStatus {
  OUTSIDE = "outside",
  INSIDE = "inside",
  STUDY = "study",
}

interface IPlayerRoom {
  _id: Types.ObjectId; // THIS IS THE HOST ID (not username)
  hostStatus: PlayerRoomStatus;
  allPlayers: {
    playerId: Types.ObjectId;
    x: Number;
    y: Number;
  }[]; // NOTE: this includes host
}

const playerRoomSchema = new Schema<IPlayerRoom>(
  {
    _id: { type: Schema.Types.ObjectId, ref: "player", required: true },
    hostStatus: {
      type: String,
      enum: PlayerRoomStatus,
      default: PlayerRoomStatus.OUTSIDE,
      required: true,
    },
    allPlayers: [
      {
        playerId: {
          type: Schema.Types.ObjectId,
          ref: "player",
          required: true,
        },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],
  },
  { _id: false }
);

export const PlayerRoomModel: mongoose.Model<IPlayerRoom> = mongoose.models.PlayerRoom || model<IPlayerRoom>("PlayerRoom", playerRoomSchema);
