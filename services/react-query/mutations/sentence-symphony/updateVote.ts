import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  NewPlayerInput,
  NewSentenceSymphonyGameRoomInput,
  UpdateSentenceSymphonyGameRoomInput,
} from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { getSentenceSymphony } from "../../queries/sentence-symphony";

interface UpdateVoteParams {
  hostId: string;
  creatorId: string;
  voterId: string;
}

export async function updateVote({
  hostId,
  creatorId,
  voterId,
}: UpdateVoteParams) {
  // WARNING may break?
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  const { voteOptions } = room.data;
  const creatorIndex = voteOptions.findIndex(
    (opt) => opt.creatorId === creatorId,
  );
  const creatorOptData = voteOptions.at(creatorIndex)!;
  voteOptions[creatorIndex] = {
    creatorId,
    sentence: creatorOptData.sentence,
    voteIds: [...creatorOptData.voteIds, voterId],
  };

  console.log("UPDATING VOTE")
  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/update`,
    {
      hostId,
      voteOptions,
    } as UpdateSentenceSymphonyGameRoomInput,
  );
}

export function useUpdateVote() {
  return useMutation({
    mutationFn: async (data: UpdateVoteParams) => await updateVote(data),
  });
}
