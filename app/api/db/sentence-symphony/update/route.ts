import { NextRequest, NextResponse } from "next/server";
import {
  PlayerModel,
  SentenceSymphonyGameRoomModel,
  UpdateSentenceSymphonyGameRoomInput,
} from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as UpdateSentenceSymphonyGameRoomInput;

  await mongooseConnect();
  const doc = await SentenceSymphonyGameRoomModel.findByIdAndUpdate(data.hostId, data, { new: true });
  console.log("DATA SENT:", data, "DOC:", doc, "SUBMIT PLS")

  return NextResponse.json(doc, { status: 200 });
}
