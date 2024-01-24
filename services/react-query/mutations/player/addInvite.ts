import { UpdatePlayerInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { updateCurrentRoomId } from "../player";
import { getPlayer } from "../../queries/player";

interface AddPlayerToRoomParams {
  hostId: string;
  guestId: string;
}

/**
 * Adds the invite to the guest.
 * 
 * **NOTE: Currently, this should only be accessed by sentInvite() in player-room.**
 */
export async function addInvite({
    guestId,
    hostId
}: AddPlayerToRoomParams) {
  // get player
  const guest = (await getPlayer(hostId))?.data;
  if (!guest) throw Error("Player could not be found.");

  // add invite
  const { invitesFrom } = guest;
  invitesFrom.push(hostId);

  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/update`,
    { uid: guestId, invitesFrom } as UpdatePlayerInput,
  );
}

export function useAddInvite() {
  return useMutation({
    mutationFn: async (data: AddPlayerToRoomParams) =>
      await addInvite(data),
  });
}
