import { ISendPlayerDataParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { channelName, senderData, targetId } =
    (await req.json()) as ISendPlayerDataParams;

  if (!channelName || !senderData) {
    throw new Error(
      "This is a developer error. Please ensure that you have passed in channel name and sender id. If you want a specific person, also specify target ID.",
    );
  }

  await pusherServer.trigger(channelName, "recieve-player-data", {
    channelName,
    senderData,
    targetId,
  } as ISendPlayerDataParams);

  return NextResponse.json({ status: 200 });
}
