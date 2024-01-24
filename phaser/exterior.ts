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
import { redirect } from "next/navigation";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { PresenceChannel } from "pusher-js";
import { NextResponse } from "next/server";
import { PresenceChannelData } from "pusher";
import { useGameStore } from "../stores/gameStore";
import { Session } from "lucia";
import { useLuciaSession } from "../services/lucia/LuciaSessionProvider";
import interior from "./interior";
import studyroom from "./studyroom";
import loadSprites from "./functions";

class exterior extends Phaser.Scene {
    constructor () {
        super("exterior");
    }
    preload() {
        // background
        this.load.image("tiles", "/backgrounds/homeBg.png");
        this.load.tilemapTiledJSON("map", "/backgrounds/background.json");

        // collision objects
        this.load.image("house", "/objects/house.png");
        this.load.image("swan", "/objects/swan.png");
        this.load.image("transparent", "/backgrounds/transparent.png");

        loadSprites(this)
      }

    create() {
      
      // access arrow keys
      const cursors = this.registry.get(
        "cursors",
      ) as Phaser.Types.Input.Keyboard.CursorKeys;

      // create one-tile tilemap
      const map = this.make.tilemap({
        key: "map",
        tileWidth: 1668,
        tileHeight: 2224,
      });

      const tileset = map.addTilesetImage("homeBg", "tiles");
      const layer = map.createLayer("layer", tileset!, 0, 0);

      // create static house and door
      const house = this.physics.add.image(730, 400, "house");
      house.setImmovable(true);
      const door = this.physics.add.image(730, 400, "house");
      door.setImmovable(true);

      // modifying collision box of house
      house.setOrigin(0.5, 0.5);
      house.setSize(430, 160);
      house.setOffset(0, 30);

      // modifying collision box of door
      door.setOrigin(0.5, 0.5);
      door.setSize(80, 50);
      door.setOffset(90, 200);

      const swan = this.physics.add.image(1600, 700, "swan");
      swan.setDepth(2);
      swan.setImmovable(true);
      swan.setOrigin(0.5, 0.5);
      swan.setSize(120, 60);
      swan.setOffset(15, 0);

      const lowerPond = this.physics.add.image(2240, 1200, "transparent");
      lowerPond.setImmovable(true);
      lowerPond.setOrigin(0.5, 0.5);
      lowerPond.setSize(630, 190);
      lowerPond.setOffset(0, 0);
      const self = this as Phaser.Scene;

      const upperPond = this.physics.add.image(2415, 1230, "transparent");
      upperPond.setImmovable(true);
      upperPond.setOrigin(0.5, 0.5);
      upperPond.setSize(300, 70);
      upperPond.setOffset(0, -100);

      const midPond = this.physics.add.image(2350, 1170, "transparent");
      midPond.setImmovable(true);
      midPond.setOrigin(0.5, 0.5);
      midPond.setSize(430, 30);
      midPond.setOffset(0, 0);

      // pusher values
      const presenceChannel = pusherClient.subscribe("presence-channel");
      // this.registry.set("socket_id", pusherClient.connection.socket_id);

      // display player sprite
      const player = this.physics.add.sprite(700, 650, "bunny");

      // collision between player and house
      this.physics.add.collider(player, house);

      // collision between player and pond
      this.physics.add.collider(player, lowerPond);
      this.physics.add.collider(player, midPond);
      this.physics.add.collider(player, upperPond);

      // camera follows player
      this.cameras.main.startFollow(player);
      this.cameras.main.setZoom(1.2, 1.2);

      // set bounds on player movement
      player.setCollideWorldBounds(true);
      this.physics.world.enable(player);

      // camera bounds
      this.cameras.main.setBounds(
        0,
        0,
        map.widthInPixels,
        map.heightInPixels,
      );

      // world bounds
      this.physics.world.setBounds(
        0,
        370,
        map.widthInPixels,
        map.heightInPixels - 370,
      );

      player.setDataEnabled();

      // stores player, door, swan in Scene registry
      this.registry.set("player", player);
      this.registry.set("door", door);
      this.registry.set("swan", swan);

      // store other players
      const otherPlayers = this.physics.add.group({
        collideWorldBounds: true,
      });

      this.data.set("otherPlayers", otherPlayers);

      // controls
      this.registry.set("cursors", this.input.keyboard!.createCursorKeys());
      this.registry.set("physics", this.physics);

      // listens for successful subscription
      presenceChannel.bind(
        "pusher:subscription_succeeded",
        async (members: any) => {
          // useRedirectStore.setState({ redirect: false });
          const x = player.x;
          const y = player.y;
          this.registry.set("socket_id", pusherClient.connection.socket_id);
          // alerts server of new player and server loads current players
          console.log("subcribed");
          console.log("added and posting", this.registry.get("socket_id"));
          await axios.post("/api/pusher/currentPlayers", {
            x: 0,
            y: 450,
            playerId: this.registry.get("socket_id") as string,
          });
        },
      );

      // presenceChannel.bind(
      //   "pusher:subscription_error",
      //   async (error: any) => {
      //     switch (error.status) {
      //       case 403:
      //         const localUid = session.data?.user.uid;
      //         const localSocketId = pusherClient.connection.socket_id;

      //         // if the socket ID match, then we are on the right tab and hence it was a rerender issue, so DON'T REDIRECT
      //         if (localUid && localSocketId) {
      //           const storedUserInfo = (
      //             presenceChannel as PresenceChannel
      //           ).members.get(localUid) as PresenceChannelData;
      //           console.log("stored", storedUserInfo);
      //           if (storedUserInfo) {
      //             const { socket_id } =
      //               storedUserInfo.user_info! as PlayerRoomUserInfo;
      //             console.log("local", localSocketId);
      //             if (localSocketId === socket_id) {
      //               return;
      //             }
      //           }

      //           useRedirectStore.setState({ redirect: true });
      //         }
      //         break;
      //     }
      //   },
      // );

      // listens for when a new member subscribes to channel
      // presenceChannel.bind(
      //   "pusher:member_added",
      //   async (player: { id: string; info: object }) => {
      //     if (player.id != (this.registry.get("socket_id") as string)) {
      //       addOtherPlayer(this, { x: 100, y: 450, playerId: player.id });
      //     }
      //   },
      // );

      // // deletes player when they unsubscribe from channel
      // presenceChannel.bind(
      //   "pusher:member_removed",
      //   (player: { id: string; info: object }) => {
      //     const playerId = player.id;
      //     otherPlayers.getChildren().forEach(function (otherPlayer) {
      //       if (playerId === (otherPlayer.data.get("playerId") as string)) {
      //         otherPlayer.destroy();
      //       }
      //     });
      //   },
      // );

      // listens for when new players join and adds current players to the new player's screen
      // presenceChannel.bind(
      //   "currentPlayers",
      //   (data: { players: any; newPlayerId: string }) => {
      //     console.log("current players", data.players);
      //     const playerId = this.registry.get("socket_id");
      //     console.log("ids", playerId, data.newPlayerId);

      //     if (playerId === data.newPlayerId) {
      //       Object.keys(data.players).forEach(function (id) {
      //         console.log("h", id, data.players[id]);
      //         addOtherPlayer(self, data.players[id]);
      //       });
      //     }
      //   },
      // );

      // // updates location of other players
      // presenceChannel.bind("playerMoved", (playerInfo: PlayerInfo) => {
      //   const otherPlayers = this.data.get(
      //     "otherPlayers",
      //   ) as Phaser.GameObjects.Group;

      //   (otherPlayers.getChildren() as Phaser.GameObjects.Sprite[]).forEach(
      //     function (otherPlayer) {
      //       if (
      //         playerInfo.playerId ===
      //         (otherPlayer.data.get("playerId") as string)
      //       ) {
      //         otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      //       }
      //     },
      //   );
      // });

      // create animations
      this.anims.create({
        key: "move",
        frames: this.anims.generateFrameNumbers("bunny", {
          start: 0,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "turn",
        frames: [{ key: "bunny", frame: 0 }],
        frameRate: 20,
      });
    }

    async update() {
      const self = this as Phaser.Scene;
      const player = self.registry.get("player") as Phaser.GameObjects.Sprite;
      const door = self.registry.get("door") as Phaser.GameObjects.Sprite;
      const swan = self.registry.get("swan") as Phaser.GameObjects.Sprite;
      const updatedShowInvite = useGameStore.getState().showInvitePopup;
      const updatedShowMail = useGameStore.getState().showMailPopup;

      // detect overlap betweesn player and door
      self.physics.add.overlap(player, door, () => {
        const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
        const isDown = keyObj.isDown;
      });

      // checks if player is overlapping with door
      const isOverlappingDoor = self.physics.world.overlap(player, door);
      const isOverlappingSwan = self.physics.world.overlap(player, swan);

      // displays enter house text when overlapping
      if (isOverlappingDoor) {
        useGameStore.setState({text: "Press [Enter] to enter"});
        const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
        const isDown = keyObj.isDown;

        // enters house when enter key is pressed
        if (isDown && !updatedShowInvite && !updatedShowMail) {
          useGameStore.setState({ scenes: [interior, exterior, studyroom] })
        }
      } else if (
        isOverlappingSwan &&
        !updatedShowInvite &&
        !updatedShowMail
      ) {
        const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
        const isDown = keyObj.isDown;
        useGameStore.setState({text: "Press [Enter] to travel"});
        if (isDown) {
          useGameStore.getState().showPopup("invite");
        }
      } else {
        useGameStore.setState({text: ""});
      }

      // access arrow keys
      const cursors = self.registry.get(
        "cursors",
      ) as Phaser.Types.Input.Keyboard.CursorKeys;

      // player movement

      if (cursors.left.isDown) {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityX(-200);

        player.anims.play("move", true);
      } else if (cursors.right.isDown) {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityX(200);

        player.anims.play("move", true);
      } else if (cursors.up.isDown) {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityY(-200);

        player.anims.play("move", true);
      } else if (cursors.down.isDown) {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityY(200);

        player.anims.play("move", true);
      } else {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityX(0);
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityY(0);

        player.anims.play("turn");
      }

      if (
        cursors.up.isDown &&
        (player.body! as Phaser.Physics.Arcade.Body).touching.down
      ) {
        (player.body! as Phaser.Physics.Arcade.Body).setVelocityY(-330);
      }

      // stores current player's location
      const x = player.x;
      const y = player.y;

      // stores current player's previous location
      const oldPosition = player.data?.get("oldPosition") as
        | { x: number; y: number }
        | undefined;

      // checks if position changed
      if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y)) {
        await axios.post("/api/pusher/playerMoved", {
          x,
          y,
          playerId: self.registry.get("socket_id") as string,
        });
      }

      // saves old position
      player.data?.set("oldPosition", {
        x,
        y,
      });
    }
    
}

export default exterior;