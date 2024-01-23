import {
  UpdatePlayerInput,
} from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface UpdateCurrentRoomIdParams {
  uid: string;
  roomHostId: string;
}

/**
 * Update the player's currentPlayerRoomId.
 */
export async function updateCurrentRoomId({
  uid,
  roomHostId,
}: UpdateCurrentRoomIdParams) {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player/update`,
    { uid, currentPlayerRoomId: roomHostId } as UpdatePlayerInput,
  );
}

export function useUpdateCurrentRoomId() {
  return useMutation({
    mutationFn: async (data: UpdateCurrentRoomIdParams) =>
      await updateCurrentRoomId(data),
  });
}
