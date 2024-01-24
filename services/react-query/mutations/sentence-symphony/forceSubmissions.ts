import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  NewPlayerInput,
  NewSentenceSymphonyGameRoomInput,
  UpdateSentenceSymphonyGameRoomInput,
} from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { getSentenceSymphony } from "../../queries/sentence-symphony";

interface ForceSubmissionsParams {
  hostId: string;
}

export async function forceSubmissions({ hostId }: ForceSubmissionsParams) {
  // WARNING may break?
  const room = await getSentenceSymphony(hostId);
  if (!room.data) {
    throw Error("Room could not be found.");
  }

  const { allPlayers, voteOptions } = room.data;

  const allIds = allPlayers.map((player) => player.playerId);
  const submittedIds = voteOptions.map((opt) => opt.creatorId);
  const notSubmittedIds = allIds.filter(
    (playerId) => !submittedIds.includes(playerId),
  );

  const completeVoteOptions = [
    ...voteOptions,
    ...notSubmittedIds.map((id) => ({
      creatorId: id,
      voterIds: [],
      sentence: `This is a test by ${id}`,
    })),
  ];

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/update`,
    {
      hostId,
      voteOptions: completeVoteOptions,
    } as UpdateSentenceSymphonyGameRoomInput,
  );
}

export function useForceSubmissions() {
  return useMutation({
    mutationFn: async (data: ForceSubmissionsParams) =>
      await forceSubmissions(data),
  });
}
