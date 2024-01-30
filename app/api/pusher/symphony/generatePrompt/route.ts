import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Prompt {
    prompt: string;
    hostUsername:string;
}



export async function POST(req: NextRequest) {
  const { prompt, hostUsername } = (await req.json()) as Prompt;


    await pusherServer.trigger(`presence-ss-${hostUsername}`, 'generatePrompt',{
        prompt,
      })




  return NextResponse.json({ status: 200 });
}
