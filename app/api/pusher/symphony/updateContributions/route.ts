import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Input {

    hostUsername:string
    contributions:boolean
    winnerId:string[]
    tie:boolean
}

interface Contribution {
    playerName: string;
    value: number;
  }
export async function POST(req: NextRequest) {
    const {hostUsername,contributions,winnerId,tie } = (await req.json()) as Input;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, "updateContributions", {

        contributions,
        winnerId,
        tie
    });



    return NextResponse.json({ status: 200 });
}
