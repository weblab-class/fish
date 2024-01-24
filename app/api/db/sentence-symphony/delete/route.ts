import { NextRequest, NextResponse } from "next/server";
import {
  PlayerModel,
  SentenceSymphonyGameRoomModel,
  UpdateSentenceSymphonyGameRoomInput,
} from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function DELETE(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId");

  await mongooseConnect();
  const player = await SentenceSymphonyGameRoomModel.findByIdAndDelete(hostId);

  return NextResponse.json("Successfully deleted", { status: 200 });
}
