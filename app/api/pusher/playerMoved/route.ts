import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";

export async function POST(req: NextRequest) {
  return await authorizeApiRoute(req, async (session) => {
    const { x, y, playerId } = (await req.json()) as PlayerInfo;

    await pusherServer.trigger("presence-channel", "playerMoved", {
      x,
      y,
      playerId,
    });

    return NextResponse.json({ status: 200 });
  });
}