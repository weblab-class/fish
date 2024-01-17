import mongoose, { Schema, Types } from "mongoose";

import { gameRoomSchema, IGameRoom, GameRoomModel } from "./BaseGameRoom";

interface ISentenceSymphonyGameRoom extends IGameRoom {
  initialPrompt: string;
  voteOptions: {
    sentence: string;
    creatorId: Types.ObjectId;
    voteIds: Types.ObjectId[];
  }[];
  scores: {
    playerId: Types.ObjectId;
    roundsWon: number;
  }[];
  sentences: string[];
}

const sentenceSymphonyGameRoomSchema = new Schema<ISentenceSymphonyGameRoom>({
  initialPrompt: { type: String, required: true },
  voteOptions: [
    {
      sentence: { type: String, required: true },
      creatorId: { type: Schema.Types.ObjectId, required: true },
      voteIds: [{ type: Schema.Types.ObjectId, required: true }],
    },
  ],
  scores: [
    {
      playerId: { type: Schema.Types.ObjectId, required: true, ref: "Player" },
      roundsWon: Number,
    },
  ],
  sentences: [{ type: String, required: true }],
});

export const SentenceSymphonyGameRoomModel = mongoose.models.SentenceSymphony || GameRoomModel.discriminator("SentenceSymphony", sentenceSymphonyGameRoomSchema);
  