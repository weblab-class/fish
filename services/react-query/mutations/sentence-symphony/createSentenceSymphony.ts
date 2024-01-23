import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput, NewSentenceSymphonyGameRoomInput } from "../../../mongo/models";
import { mongooseConnect } from "../../../mongo";

export async function createSentenceSymphony(data: NewSentenceSymphonyGameRoomInput) {
  return await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/create`, data);
}

export function useCreateSentenceSymphony() {
  return useMutation({
    mutationFn: async (data: NewSentenceSymphonyGameRoomInput) => await createSentenceSymphony(data),
  });
}
