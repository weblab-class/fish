import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Username {

    hostUsername:string
}



export async function POST(req: NextRequest) {
    const {hostUsername } = (await req.json()) as Username;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "gameRoomCreated", {

    });



    return NextResponse.json({ status: 200 });
}
