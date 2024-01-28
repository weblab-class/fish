import { Player, UpdatePlayerInput } from "@/services/mongo/models";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { updateCurrentRoomId } from "../player";
import { getPlayer, getPlayerByUsername } from "../../queries/player";
import type { types, Ref as TypeRef } from "@typegoose/typegoose";
import Mail from "@/components/Mail";

interface mailParams {
    receiverId: string,
    senderId:string,
    content:string
}

/**
 * Adds the invite to the guest.
 *
 * **NOTE: Currently, this should only be accessed by sentInvite() in player-room.**
 */
export async function deleteMail({
    receiverId,
    senderId,
    content
}: mailParams) {

  // get player
  const recipient = (await getPlayer(receiverId.toString()))?.data;
  if (!recipient) throw Error("Player could not be found.");

  let inbox = recipient.inbox


  inbox=inbox.filter(letter => letter.content !==
      content)



  return await axios.post(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/db/player/update`,
    { uid: receiverId.toString(), inbox } as UpdatePlayerInput,
  );
}

export function useDeleteMail() {
  return useMutation({
    mutationFn: async (data: mailParams) =>
      await deleteMail(data),
  });
}
