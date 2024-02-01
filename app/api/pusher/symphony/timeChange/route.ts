import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Input {

    hostUsername:string
    time:number
}

export async function POST(req: NextRequest) {
    const {hostUsername, time } = (await req.json()) as Input;




    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateTime", {
        time

    });



    return NextResponse.json({ status: 200 });
}
