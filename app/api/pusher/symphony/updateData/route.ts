import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Username {

    hostUsername:string
    voted:boolean
}

export async function POST(req: NextRequest) {
    const {hostUsername, voted } = (await req.json()) as Username;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateData", {
        voted:voted

    });



    return NextResponse.json({ status: 200 });
}
