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

export async function startNewRound({
  hostId,
  creatorId,
  voterId,
}: UpdateVoteParams) {
  // WARNING may break?
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  // votes and see which is max
  const { voteOptions } = room.data;
  const voteOptions.reduce((a,b)=>a.y>b.y?a:b).y
  // calculate score based on votes

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

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/update`,
    {
      hostId,
      voteOptions,
    } as UpdateSentenceSymphonyGameRoomInput,
  );
}

export function useStartNewRound() {
  return useMutation({
    mutationFn: async (data: UpdateVoteParams) => await startNewRound(data),
  });
}
