import { NextRequest, NextResponse } from "next/server";
import { PlayerModel } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  await mongooseConnect();

  if (!username)
    throw Error(
      "This is a developer error. Please provide a username in /api/db/get-player-by-username",
    );
  const player = await PlayerModel.find().findByUsername(username);

  return NextResponse.json(player, { status: 200 });
}
