import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { mongooseConnect } from "../../connnections";
import { Player } from "../../models";

export async function getPlayer(uid: string) {
  await mongooseConnect();

  return await axios.get<Player>("/api/db/get-player", { params: { uid } });
}

export function useGetPlayer(uid: string) {
  return useQuery({
    queryKey: ["player", uid],
    queryFn: async () => await getPlayer(uid),
  });
}
