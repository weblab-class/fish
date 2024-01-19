import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { mongooseConnect } from "../../mongo/connnections";
import { Player } from "../../mongo/models";

export async function getPlayer(uid: string) {
  await mongooseConnect();

  return await axios.get<Player | null>(`${process.env.DOMAIN}/api/db/get-player`, { params: { uid } });
}

export function useGetPlayer(uid: string) {
  return useQuery({
    queryKey: ["player", uid],
    queryFn: async () => await getPlayer(uid),
  });
}