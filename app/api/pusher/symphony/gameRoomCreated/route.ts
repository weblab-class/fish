import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    console.log("gameRoom called")

    await pusherServer.trigger("presence-game-channel", "gameRoomCreated", {

    });



    return NextResponse.json({ status: 200 });
}
