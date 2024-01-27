import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Chat{
    message: string,
    username: string,
    hostUsername:string
}
export async function POST(req: NextRequest) {
    const {message, username, hostUsername} = await req.json() as Chat;

    await pusherServer.trigger(`presence-home-chat-${hostUsername}`, "newChat", {
        message,
        username,
    });

    return NextResponse.json({ status: 200 });
}
