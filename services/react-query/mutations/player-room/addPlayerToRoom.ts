import { UpdatePlayerRoomInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { updateCurrentRoomId } from "../player";
import { getPlayerRoom } from "../../queries/player-room";

interface AddPlayerToRoomParams {
  hostId: string;
  guestId: string;
  x: number;
  y: number;
}

/**
 * Adds the player to the room. This will also update the guest's currentPlayerRoomId.
 */
export async function addPlayerToRoom({
  hostId,
  guestId,
  x,
  y,
}: AddPlayerToRoomParams) {
  // update player room
  const playerRoom = (await getPlayerRoom(hostId))?.data;
  if (!playerRoom) throw Error("Room could not be found.");

  // make sure the person isn't added twice
  const players = playerRoom.allPlayers;
  if (!players.filter(p => p.playerId === guestId).length) {
    players.push({
      playerId: guestId,
      x,
      y,
    });

      // update guest
  await updateCurrentRoomId({ uid: guestId, roomHostId: hostId });

  // add to all players
  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/update`,
    { hostId, allPlayers: [...players] } as UpdatePlayerRoomInput,
  );
  }

  return false;
}

export function useAddPlayerToRoom() {
  return useMutation({
    mutationFn: async (data: AddPlayerToRoomParams) =>
      await addPlayerToRoom(data),
  });
}
