import { pusherServer } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

interface Chat{
    message: string,
    username: string
}
export async function POST(req: NextRequest) {
    const {message, username} = await req.json() as Chat;

    await pusherServer.trigger("chat-channel", "newChat", {
        message,
        username,
    });

    return NextResponse.json({ status: 200 });
}
