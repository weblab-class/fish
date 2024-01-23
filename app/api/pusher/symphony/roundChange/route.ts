import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Round {
    newRound: string,
    roundNumber:number
}



export async function POST(req: NextRequest) {
  let { newRound, roundNumber } = (await req.json()) as Round;


  const changeRound = async () => {
    console.log(newRound)

    if (newRound==="preWriting"){
      await pusherServer.trigger('presence-game-channel', 'submitVotes',{
        roundNumber,
      })
    }
    else{
      await pusherServer.trigger('presence-game-channel', 'roundChange', {
        newRound,
        roundNumber,
    });

    }

    };
    await changeRound();


  return NextResponse.json({ status: 200 });
}
