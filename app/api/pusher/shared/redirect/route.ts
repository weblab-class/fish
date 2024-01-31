import { IRedirectParams, ISendPlayerDataParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { channelName, redirectLink, targetId } =
    (await req.json()) as IRedirectParams;

  if (!channelName || !redirectLink) {
    throw new Error(
      "This is a developer error. Please ensure that you have passed in channel name. If you want a specific person, also specify target ID.",
    );
  }

  await pusherServer.trigger(channelName, "redirect", {
    channelName,
    redirectLink,
    targetId,
  } as IRedirectParams);

  return NextResponse.json({ status: 200 });
}
