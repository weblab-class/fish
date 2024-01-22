import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {


    await pusherServer.trigger("presence-game-channel", "updateData", {
    });

    return NextResponse.json({ status: 200 });
}
