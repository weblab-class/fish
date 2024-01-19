import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { NewPlayerInput } from "../../mongo/models";
import { mongooseConnect } from "../../mongo";

export async function createPlayer(data: NewPlayerInput) {
  await mongooseConnect();

  return await axios.post(`${process.env.DOMAIN}/api/db/create-player`, data);
}

export function useCreatePlayer() {
  return useMutation({
    mutationFn: (data: NewPlayerInput) => createPlayer(data),
  });
}
