import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput, NewSentenceSymphonyGameRoomInput } from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";
import { updateRoomStatus } from "../player-room";
import { PlayerRoomStatus } from "@/types";

interface DeleteParams {
    hostId: string;
}

export async function deleteSentenceSymphony({ hostId }: DeleteParams) {
  await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/delete`, { params: { hostId }});
  return await updateRoomStatus({hostId, newRoomStatus: PlayerRoomStatus.EXTERIOR});
}

export function useDeleteSentenceSymphony() {
  return useMutation({
    mutationFn: async (data: DeleteParams) => await deleteSentenceSymphony(data),
  });
}
