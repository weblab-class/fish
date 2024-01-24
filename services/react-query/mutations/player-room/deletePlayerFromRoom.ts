import { UpdatePlayerRoomInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { updateCurrentRoomId } from "../player";
import { getPlayerRoom } from "../../queries/player-room";

interface DeletePlayerFromRoomParams {
  hostId: string;
  guestId: string;
}

/**
 * Deletes the player from the room. This will also default the guest's currentPlayerRoomId to their own. 
 * 
 * **NOTE: Use addPlayerToRoom() after calling this method if you want to replace the guest's currentPlayerRoomId.**
 */
export async function deletePlayerFromRoom({
  hostId,
  guestId,
}: DeletePlayerFromRoomParams) {
  // update room
  const playerRoom = (await getPlayerRoom(hostId))?.data;
  if (!playerRoom) throw Error("Room could not be found.");

  const players = playerRoom.allPlayers;
  const newPlayers = players.filter(p => p.playerId !== guestId);

  // update guest
  await updateCurrentRoomId({ uid: guestId, roomHostId: guestId });

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/update`,
    {
        hostId, 
        allPlayers: newPlayers,
    } as UpdatePlayerRoomInput,
  );
}

export function useDeletePlayerFromRoom() {
  return useMutation({
    mutationFn: async (data: DeletePlayerFromRoomParams) =>
      await deletePlayerFromRoom(data),
  });
}