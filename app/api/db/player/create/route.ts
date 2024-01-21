import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";
import { NewPlayerInput, PlayerModel, PlayerRoomModel } from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";
import { Types } from "mongoose";
import { PlayerRoomStatus } from "@/types";

export async function POST(req: NextRequest) {
  const { _id, animalSprite, username } = (await req.json()) as NewPlayerInput;

  await mongooseConnect();

  await PlayerModel.create({
    _id,
    animalSprite,
    username,
    currentPlayerRoomId: _id,
  });
  await PlayerRoomModel.create({
    _id,
    hostId: _id,
    hostStatus: PlayerRoomStatus.EXTERIOR,
  }); 

  return NextResponse.json("Player created", { status: 201 });
}
