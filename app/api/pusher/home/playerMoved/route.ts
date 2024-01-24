import { pusherServer } from "@/services/pusher";
import { ISendDataParams } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";
import axios from "axios";

export async function POST(req: NextRequest) {
  return await authorizeApiRoute(req, async (session) => {
    const data = (await req.json()) as ISendDataParams;
    if (data.targetId)
      throw new Error(
        "This is a developer error. When updating your movement, it should go to everyone, hence no targetId.",
      );

    await axios.post(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/pusher/home/sendData`,
      data,
    );

    return NextResponse.json({ status: 200 });
  });
}
