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

        time -= 1;
        if (time>=0){
          const triggerTimer = async () => {
            await pusherServer.trigger(`presence-ss-${hostUsername}`, 'timer', {
                time,
            });
            };
            await triggerTimer();

        } else{
          clearInterval(intervalId)
        }



    }, 1000);
  return NextResponse.json({ status: 200 });
}


export async function DELETE (req: NextRequest){
        // Stop the timer
        clearInterval(intervalId);



        return NextResponse.json({ status: 200 });


}
