import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { protectApiRoute } from "@/services/lucia/functions";

export async function POST(req: NextRequest) {
  return await protectApiRoute(req, async (session) => {
    const { x, y, playerId } = (await req.json()) as PlayerInfo;

    await pusherServer.trigger("presence-channel", "playerMoved", {
      x,
      y,
      playerId,
    });

    return NextResponse.json({ status: 200 });
  });
}
