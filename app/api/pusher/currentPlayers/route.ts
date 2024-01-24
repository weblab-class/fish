import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";

// TODO FIX THIS BUG
interface GlobalPlayers {
  [key: string]: PlayerInfo;
}
const players: GlobalPlayers = {};

export async function POST(req: NextRequest) {
  return await authorizeApiRoute(req, async (session) => {
    const { x, y, uid, sprite, username, roomStatus } = (await req.json()) as PlayerInfo;
    console.log(players);


    await pusherServer.trigger("presence-channel", "currentPlayers", {
      players,
      newPlayerId: uid,
    });

    players[uid] = {
      x,
      y,
      uid: uid,
      sprite,
      username,
      roomStatus
    };

    return NextResponse.json({ status: 200 });
  });
}
