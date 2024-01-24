import { pusherServer } from "@/services/pusher";
import { PlayerInfo } from "@/phaser/types";
import { NextRequest, NextResponse } from "next/server";
import { authorizeApiRoute } from "@/services/lucia/functions";
import {
  SentenceSymphonyGameRoomModel,
  NewSentenceSymphonyGameRoomInput,
} from "@/services/mongo/models";
import { mongooseConnect } from "@/services/mongo";
import { Types } from "mongoose";
import { PlayerRoomStatus } from "@/types";

export async function POST(req: NextRequest) {
  const { hostInfo, otherPlayerInfo, initialPrompt } =
    (await req.json()) as NewSentenceSymphonyGameRoomInput;
  const allPlayerInfo = [hostInfo, ...otherPlayerInfo];

  await mongooseConnect();
  await SentenceSymphonyGameRoomModel.create({
    _id: hostInfo.uid,
    hostId: hostInfo.uid,
    allPlayers: [
      ...allPlayerInfo.map((info) => ({
        playerId: info.uid,
        gameName: info.username,
      })),
    ],
    initialPrompt,
  });

  return NextResponse.json("Sentence symphony game created", { status: 201 });
}
