import { useMutation } from "@tanstack/react-query";
import { NewPlayerInput } from "../../models";
import axios from "axios";
import { mongooseConnect } from "../../connnections";
import mongoose from "mongoose";

export async function createPlayer(data: NewPlayerInput) {
  await mongooseConnect();

  return await axios.post("/api/db/create-player", data);
}

export function useCreatePlayer() {
  return useMutation({
    mutationFn: (data: NewPlayerInput) => createPlayer(data),
  });
}
