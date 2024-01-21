import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput } from "../../mongo/models";
import { mongooseConnect } from "../../mongo";

export async function createPlayer(data: NewPlayerInput) {
  return await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player/create`, data);
}

export function useCreatePlayer() {
  return useMutation({
    mutationFn: async (data: NewPlayerInput) => await createPlayer(data),
  });
}
