import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface TimerRequest {
    time:number,
    hostUsername:string
}

let intervalId: NodeJS.Timeout | undefined;


export async function POST(req: NextRequest) {
  let { time, hostUsername } = (await req.json()) as TimerRequest;

    intervalId = setInterval(async () => {
        console.log(time);
        time -= 1;

        const triggerTimer = async () => {
        await pusherServer.trigger(`presence-ss-${hostUsername}`, 'timer', {
            time,
        });
        };
        await triggerTimer();

    }, 1000);
  return NextResponse.json({ status: 200 });
}


export async function DELETE (req: NextRequest){
        // Stop the timer
        clearInterval(intervalId);
        console.log('cleared')

        return NextResponse.json({ status: 200 });


}
