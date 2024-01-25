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
      const studyroom = this.add.image(750, 425, "studyroom");
      studyroom.setDepth(1)

      useGameStore.setState({text: ""});

      for (let i = 0; i < 6; i++) {
        const sprite = document.createElement("div")
        
        sprite.className = "bg-[url('/players/bunnyOne.png')] bg-no-repeat -mb-10 m-1 bg-contain h-45% bg-center w-3/12 flex items-end justify-center";
        const desk = document.createElement("img");
        desk.className = "bottom-0 h-20 w-70 desk";
        desk.src = "/objects/Desk.png";
        sprite.appendChild(desk);
        Phaser.DOM.AddToDOM(sprite, "studyroom_load_sprites");
      }
    }
  }

export default studyroom;