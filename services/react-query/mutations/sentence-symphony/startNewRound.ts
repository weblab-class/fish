import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { takeWhile as _takeWhile, random as _random } from "lodash";

import {
  NewPlayerInput,
  NewSentenceSymphonyGameRoomInput,
  SSVoteOption,
  UpdateSentenceSymphonyGameRoomInput,
} from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { getSentenceSymphony } from "../../queries/sentence-symphony";

interface StartNewRoundParams {
  hostId: string;
  prevWinner: SSVoteOption;
}

export async function startNewRound({
  hostId,
  prevWinner
}: StartNewRoundParams) {
  // WARNING may break?
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  // determine sentence to be appended by sorting high to low votes
  // NOTE: if tie, pick a random sentence
  const { voteOptions, sentences, scores } = room.data;

  // append winner sentence
  sentences.push({sentence: prevWinner.sentence, creatorId: prevWinner.creatorId});

  // now tally everyone's score based on votes
  const scoresMap = new Map<string, number>();
  for (const s of scores) {
    scoresMap.set(s.playerId.toString(), s.score);
  }
  for (const opt of voteOptions) {
    const oldScore = scoresMap.get(opt.creatorId.toString())!;
    scoresMap.set(opt.creatorId.toString(), oldScore + opt.voteIds.length);
  }

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/update`,
    {
      hostId,
      voteOptions: [],
      scores: Array.from(scoresMap).map(([key, val]) => ({
        playerId: key,
        score: val,
      })),
      sentences

    } as UpdateSentenceSymphonyGameRoomInput,
  );
}

export function useStartNewRound() {
  return useMutation({
    mutationFn: async (data: StartNewRoundParams) => await startNewRound(data),
  });
}
