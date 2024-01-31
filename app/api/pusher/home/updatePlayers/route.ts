import { IChangeSceneParams } from "@/phaser/types";
import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface UpdateParams{
    hostUsername:string


}
export async function POST(req: NextRequest) {
    const {hostUsername} = await req.json() as UpdateParams;


    await pusherServer.trigger(`presence-study-${hostUsername}`, "updateStudy", {


    } as IChangeSceneParams);

    return NextResponse.json({ status: 200 });
}
