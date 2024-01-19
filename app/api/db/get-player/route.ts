import { NextRequest, NextResponse } from "next/server";
import { PlayerModel } from "@/services/mongo/models";

export async function GET(req: NextRequest) { 
  const uid = req.nextUrl.searchParams.get("uid");
  const player = await PlayerModel.findById(uid);

  return NextResponse.json(player, { status: 200 });
}
