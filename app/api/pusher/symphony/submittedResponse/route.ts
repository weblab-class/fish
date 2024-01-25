import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Players {
    playerSocketId: number,
    members: []
    hostUsername:string

}

// each player calls this after submitting a response (story snippet)
export async function POST(req: NextRequest) {
    let { playerSocketId, members } = (await req.json()) as Players;

    // triggers host to check if all members submitted a response




  return NextResponse.json({ status: 200 });
}

interface Story{
    currentStory:string,
    hostUsername:string
}
// called after voting is finished
export async function PUT(req: NextRequest) {
    let { currentStory,hostUsername } = (await req.json()) as Story;
    // let responseVotes=[]

    // response card component will send the response to db is they are clicked
    await pusherServer.trigger(`presence-ss-vote-${hostUsername}`,'countVotes',{})

    // get voted responses from db
    // responseVotes=[]


    // send mostVoted to host and host will combine it with the story and display the most voted response
    // await pusherServer.trigger(`presence-ss-${hostUsername}`,'mostVoted',{})



  return NextResponse.json({ status: 200 });
}
