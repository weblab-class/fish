import { NextRequest, NextResponse } from "next/server";
import { PlayerModel, SentenceSymphonyGameRoomModel } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId");

  await mongooseConnect();
  const player = await SentenceSymphonyGameRoomModel.findById(hostId);

  return NextResponse.json(player, { status: 200 });
}
