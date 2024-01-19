import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";
import { NewPlayerInput, PlayerModel } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";

export async function POST(req: NextRequest) {
  const { _id, animalSprite, username } = (await req.json()) as NewPlayerInput;

  await PlayerModel.create({ _id, animalSprite, username });

  return NextResponse.json("Player created", { status: 201 });
}
