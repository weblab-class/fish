import { IRedirectParams, ISendPlayerDataParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { updateRoomStatus } from "@/services/react-query/mutations/player-room";
import { getPlayerByUsername } from "@/services/react-query/queries/player";
import { PlayerRoomStatus } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { channelName, redirectLink, targetId } =
    (await req.json()) as IRedirectParams;

  if (!channelName || !redirectLink) {
    throw new Error(
      "This is a developer error. Please ensure that you have passed in channel name and redirect link. If you want a specific person, also specify target ID.",
    );
  }

  // we know game is being created, so update database
  if (redirectLink.includes("game")) {
    const hostUsername = channelName.split("-").at(-1)!;
    const host = await getPlayerByUsername(hostUsername);

    if (!host?.data) {
      throw new Error(
        "Host not found."
      );
    }

    await updateRoomStatus({hostId: host.data[0]._id.toString(), newRoomStatus: PlayerRoomStatus.SENTENCE_SYMPHONY});
  }

  await pusherServer.trigger(channelName, "redirect", {
    channelName,
    redirectLink,
    targetId,
  } as IRedirectParams);

  return NextResponse.json({ status: 200 });
}
