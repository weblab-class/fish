import { NextRequest, NextResponse } from "next/server";
import {
  PlayerRoomModel,
  UpdatePlayerRoomInput,
} from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as UpdatePlayerRoomInput;

  await mongooseConnect();
  const doc = await PlayerRoomModel.findByIdAndUpdate(data.hostId, data, {
    new: true,
  });

  return NextResponse.json(doc, { status: 200 });
}
