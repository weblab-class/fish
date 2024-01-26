import { NextRequest } from "next/server";
import { pusherServer } from "@/services/pusher";
import { NextResponse } from "next/server";
import { Voltaire } from "next/font/google";


interface Input {
    response:{sentence:string, creatorId:string, voterIds:string[]},
    hostUsername:string,
    creatorId:string
}


export async function POST(req: NextRequest) {
    let { response, hostUsername } = (await req.json()) as Input;
    // let responseVotes=[]
    console.log("submitting responses new", response)

    // response card component will send the response to db is they are clicked
    await pusherServer.trigger(`presence-ss-host-${hostUsername}`,'submitSentence',{response})



  return NextResponse.json({ status: 200 });
}

interface Vote{
    creatorId:string,
    voterId:string,
    hostUsername:string,
    responsesData: { creatorId: string; sentence: string; voterIds: string[] }[];

}
export async function PUT(req: NextRequest) {
    let { creatorId, voterId, hostUsername,responsesData } = (await req.json()) as Vote;
    // let responseVotes=[]

    console.log("voting yeyeye", creatorId,voterId)

    // response card component will send the response to db is they are clicked
    await pusherServer.trigger(`presence-ss-host-${hostUsername}`,'submitVote',
    {
        creatorId,
        voterId,
        responsesData

    })



  return NextResponse.json({ status: 200 });

}
interface host{
    hostUsername:string
}
