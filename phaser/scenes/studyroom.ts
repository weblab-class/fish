import { Scene } from "phaser";
import { Game as PhaserGame } from "phaser";
import { useEffect, useRef, useState } from "react";

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
import { useHomeStore, useMultiplayerStore } from "../stores";
import interior from "./interior";
import { PusherPresenceUserInfo, pusherClient } from "@/services/pusher";
import { PlayerRoomStatus } from "@/types";

const useIsFirstLoadedStore = create<{ isFirstLoaded: boolean }>((set) => ({
  isFirstLoaded: true,
}));

class studyroom extends Scene {
    sprites: HTMLDivElement[];

    private hostUsername:string


    constructor(hostUsername: string) {
      super("studyroom");
      this.hostUsername = hostUsername;


      this.sprites = [];
    }

    preload() {

      this.load.image("studyroom", "/backgrounds/studyroom.png");



    }

    create() {

      // const player = this.physics.add.sprite(725, 830, "transparent");
      const { sprite, uid, username } = useMultiplayerStore.getState().currentPlayer!;
      const player = this.physics.add.sprite(-100, -100, sprite);  // position will change when calling initCurrent
      const remainingInitialization = useMultiplayerStore.getState().initCurrent(uid, username, sprite, player, this.hostUsername, PlayerRoomStatus.INTERIOR);
      useMultiplayerStore.getState().sendMyData({ });

      this.sprites = [];

      // const studyroom = this.add.image(750, 425, "studyroom");
      player.setDataEnabled();
      this.registry.set("player", player);


      useHomeStore.setState({text: ""});

      const homeChannel= pusherClient.subscribe(`presence-home-${this.hostUsername}`) as PresenceChannel;
      const studyChannel= pusherClient.subscribe(`presence-study-${this.hostUsername}`) as PresenceChannel;

      studyChannel.bind("updateStudy",()=>{

        this.sprites.forEach((sprite) => {
          if (sprite && sprite.parentNode) {
            sprite.parentNode.removeChild(sprite);
          }

        });

        this.sprites = [];

        const allPlayers= homeChannel.members.each(({id, info}: { id: string, info: PusherPresenceUserInfo}) => {


          const spriteAnimal=info.sprite

          const sprite = document.createElement("div")

            sprite.className = `bg-[url(/players/${spriteAnimal}One.png)] z-50 bg-no-repeat -mb-10 m-1 bg-contain h-45% bg-center w-3/12 flex items-end justify-center`;
            sprite.style.backgroundImage=`url(/players/${spriteAnimal}One.png)`

            const desk = document.createElement("img");
            desk.className = "bottom-0 h-20 w-70 desk";
            desk.src = "/objects/Desk.png";

            sprite.appendChild(desk);
            this.sprites.push(sprite);
            Phaser.DOM.AddToDOM(sprite, "studyroom_load_sprites");




        })

      })

      // TO DO: GET PLAYERS FROM PRESENCE, PLAYERS.MAP(()) CHANGE bg-[url(/players/${player.sprite}One.png)]
      const allPlayers= homeChannel.members.each(({id, info}: { id: string, info: PusherPresenceUserInfo}) => {


        const spriteAnimal=info.sprite

        const sprite = document.createElement("div")

          sprite.className = `bg-[url(/players/${spriteAnimal}One.png)] z-50 bg-no-repeat -mb-10 m-1 bg-contain h-45% bg-center w-3/12 flex items-end justify-center`;
          sprite.style.backgroundImage=`url(/players/${spriteAnimal}One.png)`

          const desk = document.createElement("img");
          desk.className = "bottom-0 h-20 w-70 desk";
          desk.src = "/objects/Desk.png";

          sprite.appendChild(desk);
          this.sprites.push(sprite);
          Phaser.DOM.AddToDOM(sprite, "studyroom_load_sprites");




      })

      console.log("isFirstLoad STUDY", useIsFirstLoadedStore.getState().isFirstLoaded);
      if (
        useIsFirstLoadedStore.getState().isFirstLoaded &&
        remainingInitialization
      ) {
        console.log("OKAY STUDY");

        return new Promise(async (resolve) => {
          console.log("OH STUDY");
          await remainingInitialization();
          console.log("YAY STUDY");
          useIsFirstLoadedStore.setState({ isFirstLoaded: false });
          resolve("hello");
        });
      }

      useIsFirstLoadedStore.setState({ isFirstLoaded: false });
    }

    cleanup() {

      this.sprites.forEach((sprite) => {
        if (sprite && sprite.parentNode) {
          sprite.parentNode.removeChild(sprite);
        }

      });

      this.sprites = [];

      pusherClient.unsubscribe(`presence-study-${this.hostUsername}`)



    }

  }

export default studyroom;
