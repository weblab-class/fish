import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput } from "../../mongo/models";
import { mongooseConnect } from "../../mongo/connnections";

export async function createPlayer(data: NewPlayerInput) {
  console.log("bruh");
  console.log("yoooo")
  console.log(process.env.NEXT_PUBLIC_DOMAIN)
  return await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/create-player`, data);
}

export function useCreatePlayer() {
  return useMutation({
    mutationFn: async (data: NewPlayerInput) => await createPlayer(data),
  });
}
