import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Username {

    hostUsername:string
    voted:boolean
}

export async function POST(req: NextRequest) {
    const {hostUsername } = (await req.json()) as Username;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateContributions", {


    });



    return NextResponse.json({ status: 200 });
}
