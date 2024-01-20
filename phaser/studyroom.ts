import Phaser from "phaser";
import { Game as PhaserGame } from "phaser";
import { useEffect, useRef, useState } from "react";
import {
  // PlayerRoomUserInfo,
  // PusherError,
  pusherClient,
} from "../services/pusher";
// import { PlayerInfo } from "./types";
import axios from "axios";
import { Session } from "lucia";
import { useLuciaSession } from "../services/lucia/LuciaSessionProvider";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { useGameStore } from "../stores/gameStore";
import interior from "./interior";
import loadSprites from "./functions";

class studyroom extends Phaser.Scene {

    constructor() {
      super("studyroom");
    }
  
    preload() {
      this.load.image('blackBg', '/backgrounds/blackBg.jpeg');
      this.load.image("studyroom", "/backgrounds/studyroom.png");
  
      loadSprites(this);
    }
  
    create() {
      this.add.image(0, 0, 'blackBg').setOrigin(0);
      this.add.image(750, 440, "studyroom");
      
    }
  }

export default studyroom;