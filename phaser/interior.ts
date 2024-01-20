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
import exterior from "./exterior";
import studyroom from "./studyroom";
import loadSprites from "./functions";
import { Session } from "lucia";
import { getPlayer } from "@/services/react-query";
import { Player } from "@/services/mongo/models";
import { Rock_Salt, Pixelify_Sans } from "next/font/google";

class interior extends Phaser.Scene {
  getHostUsername() {
    return useGameStore.getState().hostUsername;
  }

  constructor() {
    super("interior");
    this.i = 0;
  }

  preload() {
    //collision objects
    this.load.image("couch", "/objects/Couch.png");
    this.load.image("drawer", "/objects/Drawer.png");
    this.load.image("plant1", "/objects/Plant.png");
    this.load.image("plant2", "/objects/Plant.png");
    this.load.image("lamp", "/objects/Lamp.png");
    this.load.image("tree", "/objects/Tree.png");
    this.load.image("table", "/objects/Table.png");
    this.load.image("tv", "/objects/Tv.png");
    this.load.image("stairs", "/objects/Stairs.png");

    this.load.image("tiles", "/backgrounds/Interior.png");
    this.load.tilemapTiledJSON("map", "/backgrounds/interior.json");
    this.load.image("transparent", "/backgrounds/transparent.png");

    loadSprites(this);
  }

  async create() {
    const hostTag = this.add.text(1100, 200, this.getHostUsername(), {
      font: "Rock Salt",
    });
    this.registry.set("hostTag", hostTag);

    this.hsv = Phaser.Display.Color.HSVColorWheel();
    this.text1 = this.add.text(345, 285, "Play Me", { font: "35px Pixelify Sans" });
    this.text1.setDepth(11)

    // const players = this.children.list.filter(x => x instanceof Phaser.GameObjects.Sprite);

    // create static objects
    const couch = this.physics.add.image(400, 560, "couch");
    couch.setImmovable(true);
    couch.setDepth(10);
    couch.setScale(0.5, 0.5);
    const couch_collider = this.physics.add.image(400, 585, "transparent");
    couch_collider.setImmovable(true);
    couch_collider.setDepth(10);
    couch_collider.setScale(0.12, 0.09);

    const drawer = this.physics.add.image(1240, 740, "drawer");
    drawer.setImmovable(true);
    drawer.setDepth(10);
    drawer.setScale(0.5, 0.5);
    const drawer_collider = this.physics.add.image(1240, 740, "transparent");
    drawer_collider.setImmovable(true);
    drawer_collider.setDepth(10);
    drawer_collider.setScale(0.05, 0.32);

    const plant1 = this.physics.add.image(595, 845, "plant1");
    plant1.setImmovable(true);
    plant1.setDepth(10);
    plant1.setScale(0.5, 0.5);
    const plant1_collider = this.physics.add.image(595, 865, "transparent");
    plant1_collider.setImmovable(true);
    plant1_collider.setDepth(10);
    plant1_collider.setScale(0.03, 0.05);

    // transparent box on the mats for moving between rooms, tv for game menu
    const welcomeMat = this.physics.add.image(725, 865, "transparent");
    welcomeMat.setImmovable(true);
    welcomeMat.setDepth(11);
    welcomeMat.setScale(0.09, 0.1);
    const studyMat = this.physics.add.image(1020,410, "transparent");
    studyMat.setImmovable(true);
    studyMat.setDepth(11);
    studyMat.setScale(0.09, 0.1);
    const gameMenu = this.physics.add.image(400, 460, "transparent");
    gameMenu.setImmovable(true);
    gameMenu.setDepth(11);
    gameMenu.setScale(0.09, 0.1);

    const plant2 = this.physics.add.image(860, 845, "plant2");
    plant2.setImmovable(true);
    plant2.setDepth(10);
    plant2.setScale(0.5, 0.5);
    const plant2_collider = this.physics.add.image(860, 865, "transparent");
    plant2_collider.setImmovable(true);
    plant2_collider.setDepth(10);
    plant2_collider.setScale(0.03, 0.05);

    const lamp = this.physics.add.image(245, 800, "lamp");
    lamp.setImmovable(true);
    lamp.setDepth(10);
    lamp.setScale(0.5, 0.5);
    const lamp_collider = this.physics.add.image(245, 895, "transparent");
    lamp_collider.setImmovable(true);
    lamp_collider.setDepth(10);
    lamp_collider.setScale(0.02, 0.05);

    const tree = this.physics.add.image(855, 310, "tree");
    tree.setImmovable(true);
    tree.setDepth(10);
    tree.setScale(0.5, 0.5);
    const tree_collider = this.physics.add.image(855, 400, "transparent");
    tree_collider.setImmovable(true);
    tree_collider.setDepth(10);
    tree_collider.setScale(0.02, 0.05);

    const table = this.physics.add.image(755, 580, "table");
    table.setImmovable(true);
    table.setDepth(10);
    table.setScale(0.5, 0.5);
    const table_collider = this.physics.add.image(755, 590, "transparent");
    table_collider.setImmovable(true);
    table_collider.setDepth(10);
    table_collider.setScale(0.09, 0.1);

    const tv = this.physics.add.image(400, 310, "tv");
    tv.setImmovable(true);
    tv.setDepth(10);
    tv.setScale(0.5, 0.5);

    const stairs = this.physics.add.image(1210, 300, "stairs");
    stairs.setImmovable(true);
    stairs.setDepth(10);
    stairs.setScale(0.7, 0.7);

    // access arrow keys
    const cursors = this.registry.get(
      "cursors",
    ) as Phaser.Types.Input.Keyboard.CursorKeys;

    // create one-tile tilemap
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 1500,
      tileHeight: 838,
    });

    //create single tile for interior
    const tileset = map.addTilesetImage("Interior", "tiles");
    const layer = map.createLayer("layer", tileset!, 0, 0);

    // pusher values
    const presenceChannel = pusherClient.subscribe("presence-channel");
    // this.registry.set("socket_id", pusherClient.connection.socket_id);

    // display player sprite
    const player = this.physics.add.sprite(725, 830, "bunny");

    // collisions
    this.physics.add.collider(player, couch_collider);
    this.physics.add.collider(player, tree_collider);
    this.physics.add.collider(player, plant1_collider);
    this.physics.add.collider(player, plant2_collider);
    this.physics.add.collider(player, table_collider);
    this.physics.add.collider(player, lamp_collider);
    this.physics.add.collider(player, drawer_collider);
    this.physics.add.collider(player, tv);
    this.physics.add.collider(player, stairs);

    // camera follows player
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1.2, 1.2);

    // set bounds on player movement
    player.setCollideWorldBounds(true);
    this.physics.world.enable(player);

    // camera bounds
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // world bounds
    this.physics.world.setBounds(
      200,
      290,
      map.widthInPixels - 395,
      map.heightInPixels - 410,
    );

    player.setDataEnabled();

    // stores player and other objects in Scene registry
    this.registry.set("player", player);
    this.registry.set("welcomeMat", welcomeMat);
    this.registry.set("studyMat", studyMat);
    this.registry.set("gameMenu", gameMenu);

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

              // if the socket ID match, then we are on the right tab and hence it was a rerender issue, so DON'T REDIRECT
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

    // deletes player when they unsubscribe from channel
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

    // updates location of other players
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
    const hostTag = this.registry.get("hostTag") as Phaser.GameObjects.Text;
    hostTag.setText(this.getHostUsername());
    // logic for moving the tag

    const top = this.hsv[this.i].color;
    const bottom = this.hsv[359 - this.i].color;

    this.text1.setTint(top, top, bottom, bottom);

    this.i++;

    if (this.i === 360) {
      this.i = 0;
    }
    const self = this as Phaser.Scene;
    const player = self.registry.get("player") as Phaser.GameObjects.Sprite;
    const welcomeMat = self.registry.get("welcomeMat") as Phaser.GameObjects.Sprite;
    const studyMat = self.registry.get("studyMat") as Phaser.GameObjects.Sprite;
    const gameMenu = self.registry.get("gameMenu") as Phaser.GameObjects.Sprite;

    /* moving to exterior */
    // detect overlap between player and welcome mat
    self.physics.add.overlap(player, welcomeMat, () => {
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
    });

    // checks if player is overlapping with door
    const isOverlappingWelcomeMat = self.physics.world.overlap(player, welcomeMat);

    // displays enter house text when overlapping
    if (isOverlappingWelcomeMat) {
      useGameStore.setState({text: "Press [Enter] to exit house"});
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;

      // enters house when enter key is pressed
      if (isDown) {
        useGameStore.setState({ scenes: [exterior, interior, studyroom] })
      }
    }

    /* moving to studyroom */
    // detect overlap between player and welcome mat
    self.physics.add.overlap(player, studyMat, () => {
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
    });

    // checks if player is overlapping with studyMat
    const isOverlappingStudyMat = self.physics.world.overlap(player, studyMat);

    // displays enter house text when overlapping
    if (isOverlappingStudyMat) {
      useGameStore.setState({text: "Press [Enter] to enter study room"});
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;

      // enters house when enter key is pressed
      if (isDown) {
        useGameStore.setState({ scenes: [studyroom, interior, exterior] })
      }
    }

    /* entering game menu */
    self.physics.add.overlap(player, gameMenu, () => {
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
    });

    // checks if player is overlapping with game menu
    const isOverlappingGameMenu = self.physics.world.overlap(player, gameMenu);

    // displays text when overlapping
    if (isOverlappingGameMenu) {
      useGameStore.setState({text: "Press [Enter] to enter game menu"});
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;

      // enters when enter key is pressed
      if (isDown) {
        // game menu popup
        console.log("game menu");
      }
    }

    if (!isOverlappingGameMenu && !isOverlappingStudyMat && !isOverlappingWelcomeMat) {
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

export default interior;
