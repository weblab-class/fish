import { NextRequest } from "next/server";
import { pusherServer } from "@/services/pusher";
import { NextResponse } from "next/server";


interface Input {

    hostUsername:string,

}


export async function POST(req: NextRequest) {
    let { hostUsername } = (await req.json()) as Input;
    // let responseVotes=[]

    // response card component will send the response to db is they are clicked
    console.log("deleting responses")
    await pusherServer.trigger(`presence-ss-host-${hostUsername}`,'deleteResponses',{})



  return NextResponse.json({ status: 200 });
}
