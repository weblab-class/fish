import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Input {

    hostUsername:string
    responses:{creatorId:string,sentence:string,voterIds:string}[]
}

export async function POST(req: NextRequest) {
    const {hostUsername, responses } = (await req.json()) as Input;



    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateResponses", {
        responses

    });



    return NextResponse.json({ status: 200 });
}
