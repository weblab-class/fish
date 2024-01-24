import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { PlayerRoom } from "../../../mongo/models";

export async function getPlayerRoom(hostId: string) {
  return await axios.get<PlayerRoom | null>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/get`, { params: { hostId } });
}

export function useGetPlayerRoom(hostId: string, autoRun: boolean = true) {
  return useQuery({
    queryKey: ["playerRoom", hostId],
    queryFn: async () => await getPlayerRoom(hostId),
    enabled: autoRun,
  });
}
