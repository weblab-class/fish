import { UpdatePlayerRoomInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { addInvite, updateCurrentRoomId } from "../player";
import { getPlayerRoom } from "../../queries/player-room";

interface SendInviteParams {
  hostId: string;
  guestId: string;
}

/**
 * Send an invite.
 */
export async function sendInvite({
  hostId,
  guestId,
}: SendInviteParams) {
  // update player room
  const playerRoom = (await getPlayerRoom(hostId))?.data;
  if (!playerRoom) throw Error("Room could not be found.");

  const whitelistedPeople = playerRoom.whitelist;
  if (!whitelistedPeople.includes(guestId)) {  // don't reinvite people
    whitelistedPeople.push(guestId);

    // add to guest's invite (but do not change their current room id because they just joined)
    // NOTE: changing room id happens when the user is added to the room
    await addInvite({guestId, hostId});
  
    return await axios.post(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player-room/update`,
      { hostId, whitelist: whitelistedPeople } as UpdatePlayerRoomInput,
    );
  }

  return false;
}

export function useSendInvite() {
  return useMutation({
    mutationFn: async (data: SendInviteParams) =>
      await sendInvite(data),
  });
}
