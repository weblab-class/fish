import { NextRequest, NextResponse } from "next/server";
import { PlayerRoomModel } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function GET(req: NextRequest) { 
  const hostId = req.nextUrl.searchParams.get("hostId");

  await mongooseConnect();
  const playerRoom = await PlayerRoomModel.findById(hostId);

  return NextResponse.json(playerRoom, { status: 200 });
}
