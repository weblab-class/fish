import { NextRequest, NextResponse } from "next/server";

import { protectApiRoute } from "@/services/next-auth";
import { pusherServer } from "@/services/pusher";

export async function POST(req: NextRequest) {
  return await protectApiRoute(async (session) => {
    const data = await req.text();
    const [socketId, channelName] = data
      .split("&")
      .map((str) => str.split("=")[1]);

    const presenceData = {
      user_id: socketId, // replace with auth
      user_data: { user_id: socketId },
    };

    const auth = pusherServer.authorizeChannel(
      socketId,
      channelName,
      presenceData,
    );

    return new NextResponse(JSON.stringify(auth));
  });
}
