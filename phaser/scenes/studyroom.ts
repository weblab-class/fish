import { Scene } from "phaser";
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
import { useLuciaSession } from "@/services/lucia/LuciaSessionProvider";
import { redirect } from "next/navigation";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { useHomeStore } from "../stores";
import interior from "./interior";


class studyroom extends Scene {
    sprites: HTMLDivElement[];


    constructor() {
      super("studyroom");
      this.sprites = [];
    }

    preload() {

      this.load.image("studyroom", "/backgrounds/studyroom.png");


    }

    create() {

      const player = this.physics.add.sprite(725, 830, "transparent");
      this.sprites = [];

      const studyroom = this.add.image(750, 425, "studyroom");
      player.setDataEnabled();
      this.registry.set("player", player);
      studyroom.setDepth(1)

      useHomeStore.setState({text: ""});

      for (let i = 0; i < 6; i++) {
        const sprite = document.createElement("div")

        sprite.className = "bg-[url('/players/bunnyOne.png')] z-50 bg-no-repeat -mb-10 m-1 bg-contain h-45% bg-center w-3/12 flex items-end justify-center";
        const desk = document.createElement("img");
        desk.className = "bottom-0 h-20 w-70 desk";
        desk.src = "/objects/Desk.png";
        sprite.appendChild(desk);
        this.sprites.push(sprite);
        Phaser.DOM.AddToDOM(sprite, "studyroom_load_sprites");
      }
    }

    cleanup() {

      this.sprites.forEach((sprite) => {
        if (sprite && sprite.parentNode) {
          sprite.parentNode.removeChild(sprite);
        }

      });

      this.sprites = [];


    }

  }

export default studyroom;
