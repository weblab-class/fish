import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { takeWhile as _takeWhile, random as _random } from "lodash";

import { UpdateSentenceSymphonyGameRoomInput } from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { getSentenceSymphony } from "../../queries/sentence-symphony";

interface calculateWinnerParams {
  hostId: string;
}

export async function calculateWinner({ hostId }: calculateWinnerParams) {
  // WARNING may break?
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  // determine sentence to be appended by sorting high to low votes
  // NOTE: if tie, pick a random sentence
  const { voteOptions, sentences } = room.data;
  voteOptions.sort((a, b) => b.voteIds.length - a.voteIds.length);

  const maxVoteOptions = _takeWhile(
    voteOptions,
    (v) => v.voteIds.length === voteOptions[0].voteIds.length,
  );
  const pickedOpt = maxVoteOptions[_random(0, maxVoteOptions.length - 1)];

  return pickedOpt;
}

export function useCalculateWinner(hostId: string) {
  return useQuery({
    queryKey: ["winnerSymphonyRoom", hostId],
    queryFn: async () => await calculateWinner({ hostId }),
  });
}
