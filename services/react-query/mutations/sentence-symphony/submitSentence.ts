import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  NewPlayerInput,
  NewSentenceSymphonyGameRoomInput,
  UpdateSentenceSymphonyGameRoomInput,
} from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { getSentenceSymphony } from "../../queries/sentence-symphony";

interface SubmitSentenceParams {
  hostId: string;
  creatorId: string;
  sentence: string;
}

export async function submitSentence({
  hostId,
  creatorId,
  sentence,
}: SubmitSentenceParams) {
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  const voteOptions = room.data.voteOptions;
  voteOptions.push({ sentence, creatorId, voteIds: [] });

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/update`,
    { hostId, voteOptions } as UpdateSentenceSymphonyGameRoomInput,
  );
}

export function useSubmitSentence() {
  return useMutation({
    mutationFn: async (data: SubmitSentenceParams) =>
      await submitSentence(data),
  });
}
