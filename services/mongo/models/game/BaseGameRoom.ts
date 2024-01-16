import mongoose, { model, Schema, Types } from "mongoose";

/// GAME DATA
export interface IGameData {}

const gameDataSchema = new Schema<IGameData>(
  {},
  { discriminatorKey: "gameType" }
);

/// GAME ROOM
interface IGameRoom {
  hostId: Types.ObjectId;
  allPlayers: Types.ObjectId[];
  gameData: IGameData;
}
export const gameRoomSchema = new Schema<IGameRoom>({
  hostId: { type: Schema.Types.ObjectId, ref: "player", required: true },
  allPlayers: [{ type: Schema.Types.ObjectId, ref: "player", required: true }],
  gameData: gameDataSchema,
});

export const GameRoomModel: mongoose.Model<IGameRoom> = mongoose.models.GameRoom || model<IGameRoom>("GameRoom", gameRoomSchema);







