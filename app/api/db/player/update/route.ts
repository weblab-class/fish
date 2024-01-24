import { NextRequest, NextResponse } from "next/server";
import { PlayerModel, UpdatePlayerInput } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as UpdatePlayerInput;

  await mongooseConnect();
  const doc = await PlayerModel.findByIdAndUpdate(data.uid, data, {
    new: true,
  });

  return NextResponse.json(doc, { status: 200 });
}
