import { UpdatePlayerRoomInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { updateCurrentRoomId } from "../player";
import { getPlayerRoom } from "../../queries/player-room";
import { PlayerRoomStatus } from "@/types";

interface UpdateRoomStatusParams {
  hostId: string;
  newRoomStatus: PlayerRoomStatus;
}

/**
 * Update the player room status.
 */
export async function updateRoomStatus({
  hostId,
  newRoomStatus,
}: UpdateRoomStatusParams) {
  // update player room
  const playerRoom = (await getPlayerRoom(hostId))?.data;
  if (!playerRoom) throw Error("Room could not be found.");

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/update`,
    { hostId, hostStatus: newRoomStatus } as UpdatePlayerRoomInput,
  );
}

export function useUpdateRoomStatus() {
  return useMutation({
    mutationFn: async (data: UpdateRoomStatusParams) =>
      await updateRoomStatus(data),
  });
}
