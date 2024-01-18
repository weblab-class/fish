import { Game as PhaserGame } from "phaser";
import { useEffect, useRef, useState } from "react";
import {
  PlayerRoomUserInfo,
  PusherError,
  pusherClient,
} from "@/services/pusher";
import { PlayerInfo } from "./types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { useGameStore } from "@/stores/gameStore";

class studyroom extends Phaser.Scene {
    constructor () {
        super("studyroom");
    }

    preload () {
        this.load.image("studyroom", "/backgrounds/studyroom.png");

        loadSprites()
    }

    create () {
        this.add.image(0, 0, 'studyroom').setOrigin(0, 0);
        document.getElementById("studyroom_id")?.onclick = () => {this.scene.start("studyroom")};
        //through navbar
    }
}