import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Input {

    hostUsername:string
    story:string}

export async function POST(req: NextRequest) {
    const {hostUsername, story } = (await req.json()) as Input;
    console.log("updating story", story)


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateStory", {
        story

    });



    return NextResponse.json({ status: 200 });
}
