import { Schema, Types } from "mongoose";

import { gameRoomSchema, type IGameData } from "./BaseGameRoom";

interface ISentenceSymphonyGameData extends IGameData {
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

const sentenceSymphonyGameDataSchema = new Schema<ISentenceSymphonyGameData>({
  initialPrompt: { type: String, required: true },
  voteOptions: [
    {
      sentence: { type: String, required: true },
      creatorId: { type: Schema.Types.ObjectId, required: true },
      voteIds: [{ type: Schema.Types.ObjectId, required: true }],
    },
  ],
  scores: [{}],
});

export const SentenceSymphonyGameRoomModel = gameRoomSchema
  .path<Schema.Types.Subdocument>("gameData")
  .discriminator("sentence-symphony", sentenceSymphonyGameDataSchema);
