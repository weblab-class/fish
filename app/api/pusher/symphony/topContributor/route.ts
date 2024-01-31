import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Username {

    hostUsername:string
    topContributor:string
}

export async function POST(req: NextRequest) {
    const {hostUsername, topContributor } = (await req.json()) as Username;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "topContributor", {
        topContributor

    });



    return NextResponse.json({ status: 200 });
}
