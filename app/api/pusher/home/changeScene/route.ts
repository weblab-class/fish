import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Input{
    oldScene:string,
    newScene:string,
    hostUsername:string
}
export async function POST(req: NextRequest) {
    const {hostUsername,oldScene,newScene} = await req.json() as Input;

    await pusherServer.trigger(`presence-home-${hostUsername}`, "sceneChange", {
        newScene,
        oldScene
    });

    return NextResponse.json({ status: 200 });
}
