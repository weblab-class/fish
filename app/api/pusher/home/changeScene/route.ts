import { IChangeSceneParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {channelName, oldScene,newScene, targetId} = await req.json() as IChangeSceneParams;

    await pusherServer.trigger(channelName, "sceneChange", {
        channelName,
        oldScene,
        newScene,
        targetId,
    } as IChangeSceneParams);

    return NextResponse.json({ status: 200 });
}
