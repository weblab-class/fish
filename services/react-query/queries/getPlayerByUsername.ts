import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { mongooseConnect } from "../../mongo";
import { Player } from "../../mongo/models";

export async function getPlayerByUsername(username: string) {
  return await axios.get<Player[] | null>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player/get-by-username`, { params: { username } });
}

export function useGetPlayerByUsername(uid: string) {
  return useQuery({
    queryKey: ["player", uid],
    queryFn: async () => await getPlayerByUsername(uid),
  });
}
