import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { mongooseConnect } from "../../../mongo";
import { SentenceSymphonyGameRoom } from "../../../mongo/models";

export async function getSentenceSymphony(hostId: string) {
  return await axios.get<SentenceSymphonyGameRoom | null>(`${process.env.NEXT_PUBLIC_DOMAIN}/api/db/sentence-symphony/get`, { params: { hostId } });
}

export function useGetSentenceSymphony(hostId: string) {
  return useQuery({
    queryKey: ["sentence-symphony", hostId],
    queryFn: async () => await getSentenceSymphony(hostId),
  });
}
