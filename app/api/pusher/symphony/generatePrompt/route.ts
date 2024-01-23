import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Prompt {
    prompt: string
}



export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as Prompt;


    await pusherServer.trigger('presence-game-channel', 'generatePrompt',{
        prompt,
      })

      console.log("generating")


  return NextResponse.json({ status: 200 });
}
