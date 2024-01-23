import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput, NewSentenceSymphonyGameRoomInput } from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";

interface DeleteParams {
    hostId: string;
}

export async function deleteSentenceSymphony({ hostId }: DeleteParams) {
  return await axios.delete(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/delete`, { params: { hostId }});
}

export function useDeleteSentenceSymphony() {
  return useMutation({
    mutationFn: async (data: DeleteParams) => await deleteSentenceSymphony(data),
  });
}
