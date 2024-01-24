import { IRequestDataParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { channelName, senderId, targetId } = (await req.json()) as IRequestDataParams;

  if (!channelName || !senderId) {
    throw new Error(
      "This is a developer error. Please ensure that you have passed in channel name and sender id. If you want a specific person, also specify target ID.",
    );
  }

  await pusherServer.trigger(channelName, "send-player-data", {
    channelName,
    senderId, 
    targetId,
  } as IRequestDataParams);

  return NextResponse.json({ status: 200 });
}
