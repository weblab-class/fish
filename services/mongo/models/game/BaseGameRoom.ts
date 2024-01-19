import mongoose, { model, Schema, Types } from "mongoose";

export interface IGameRoom {
  hostId: Types.ObjectId;
  allPlayers: Types.ObjectId[];
}

export const gameRoomSchema = new Schema<IGameRoom>({
  hostId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  allPlayers: [{ type: Schema.Types.ObjectId, ref: "Player", required: true }],
}, {discriminatorKey: "gameType"});

export const GameRoomModel: mongoose.Model<IGameRoom> = mongoose.models.GameRoom || model<IGameRoom>("GameRoom", gameRoomSchema);







