import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Round {
    newRound: string,
    roundNumber:number,
    hostUsername:string
}



export async function POST(req: NextRequest) {
  let { newRound, roundNumber,hostUsername } = (await req.json()) as Round;


  const changeRound = async () => {
    if (newRound==="preWriting"){
      await pusherServer.trigger(`presence-ss-${hostUsername}`, 'submitVotes',{
        roundNumber,
      })
    }
    else{
      await pusherServer.trigger(`presence-ss-${hostUsername}`, 'roundChange', {
        newRound,
        roundNumber,
    });

    }

    };
    await changeRound();


  return NextResponse.json({ status: 200 });
}
