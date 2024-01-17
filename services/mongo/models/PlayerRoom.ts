import mongoose, { model, Schema, Types } from "mongoose";

export enum PlayerRoomStatus {
  OUTSIDE = "outside",
  INSIDE = "inside",
  STUDY = "study",
}

interface IPlayerRoom {
  hostId: Types.ObjectId; // THIS IS THE HOST ID (not username)
  hostStatus: PlayerRoomStatus;
  allPlayers: {
    playerId: Types.ObjectId;
    x: Number;
    y: Number;
  }[]; // NOTE: this includes host
}

const playerRoomSchema = new Schema<IPlayerRoom>(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
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
          ref: "Player",
          required: true,
        },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],
  },
);
playerRoomSchema.pre('save', function (next) {
  if (this.isNew) {  // if new, set the document _id to the host uid
    this._id = this.hostId;
  }
  next();
});

export const PlayerRoomModel: mongoose.Model<IPlayerRoom> = mongoose.models.PlayerRoom || model<IPlayerRoom>("PlayerRoom", playerRoomSchema);
