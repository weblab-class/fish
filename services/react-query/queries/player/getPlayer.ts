import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { mongooseConnect } from "../../../mongo";
import { Player } from "../../../mongo/models";

export async function getPlayer(uid: string) {
  return await axios.get<Player | null>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player/get`, { params: { uid } });
}

export function useGetPlayer(uid: string) {
  return useQuery({
    queryKey: ["player", uid],
    queryFn: async () => await getPlayer(uid),
  });
}
