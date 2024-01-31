import axios from "axios";
import { Scene } from "phaser";

import { pusherClient } from "@/services/pusher";
import { AnimalSprite, PlayerRoomStatus } from "@/types";
import { useHomeStore, useMultiplayerStore } from "../stores";
import loadSprites, { sendPositionData, updateOtherPlayers } from "../functions";
import { FRAME_BUFFER } from "../settings/consts";
import { PlayerInfo } from "../types";
import { PresenceChannel } from "pusher-js";

/**
 * The exterior scene in `/home`.
 */
export default class exterior extends Scene {
  private hostUsername: string;
  private uid: string;
  private username: string;
  private sprite: AnimalSprite;
  private frameCounter = 0;

  constructor(hostUsername: string, uid: string, username: string, sprite: AnimalSprite) {
    super("exterior");

    this.hostUsername = hostUsername;
    this.uid = uid;
    this.username = username;
    this.sprite = sprite;
  }

  preload() {
    // background
    console.log("preloading")
    this.load.image("tiles", "/backgrounds/homeBg.png");
    this.load.tilemapTiledJSON("map", "/backgrounds/background.json");

    // collision objects
    this.load.image("house", "/objects/house.png");
    this.load.image("swan", "/objects/swan.png");
    this.load.image("mailbox","/objects/mailbox.png")
    this.load.image("transparent", "/backgrounds/transparent.png");
    this.load.image("easel","/objects/easel.png")
    this.load.image("exteriorTree","/objects/exteriorTree.png")

    loadSprites(this);
    this.load.on('fileprogress', function (file: { src: any; }) {

  });

  this.load.on('progress', function (value: any) {

});

  this.load.on('complete', function () {

  })



  }

  create() {


    // create one-tile tilemap
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 1668,
      tileHeight: 2224,
    });

    const tileset = map.addTilesetImage("homeBg", "tiles");
    map.createLayer("layer", tileset!, 0, 0);




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

    const mailbox=this.physics.add.image(500,510,"mailbox")
    mailbox.setDepth(0);
    mailbox.setImmovable(true);
    mailbox.setOrigin(0.5, 0.5);
    mailbox.setSize(60, 60);
    mailbox.setOffset(0, 0);

    const tree=this.physics.add.image(200,450,"exteriorTree")
    tree.setDepth(0);
    tree.setImmovable(true);
    tree.setOrigin(0.5, 0.5);
    tree.setSize(80, 200);
    tree.setOffset(80, 40);


    const easel=this.physics.add.image(400,700,"easel")
    easel.setOrigin(0.5, 0.5);
    easel.setSize(100, 100);
    easel.setImmovable(true);
    easel.setOffset(0, 30);

    const easelTwo=this.physics.add.image(400,700,"easel")
    easelTwo.setOrigin(0.5, 0.5);
    easelTwo.setSize(80, 20);
    easelTwo.setImmovable(true);
    easelTwo.setOffset(0, 30);


    const lowerPond = this.physics.add.image(2240, 1200, "transparent");
    lowerPond.setImmovable(true);
    lowerPond.setOrigin(0.5, 0.5);
    lowerPond.setSize(630, 190);
    lowerPond.setOffset(0, 0);

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

    // display player sprite
    const player = this.physics.add.sprite(-100, -100, this.sprite);  // position will change when calling initCurrent
    useMultiplayerStore.getState().initCurrent(this.uid, this.username, this.sprite, player, this.hostUsername, PlayerRoomStatus.EXTERIOR);
    useMultiplayerStore.getState().sendMyData({ });

    // collision between player and house
    this.physics.add.collider(player, house);

    // collision between player and pond
    this.physics.add.collider(player, lowerPond);
    this.physics.add.collider(player, midPond);
    this.physics.add.collider(player, upperPond);

    this.physics.add.collider(player,tree)
    this.physics.add.collider(player,easelTwo)

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
    this.registry.set("mailbox", mailbox);
    this.registry.set("easel",easel)

    // store other players
    const otherPlayers = this.physics.add.group({
      collideWorldBounds: true,
    });
    this.registry.set("otherPlayers", otherPlayers);

    // controls
    this.registry.set("cursors", this.input.keyboard!.createCursorKeys());
    this.registry.set("physics", this.physics);

    // create animations
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers(this.sprite, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: this.sprite, frame: 0 }],
      frameRate: 20,
    });
  }

  update() {
    const self = this as Phaser.Scene;
    const player = self.registry.get("player") as Phaser.GameObjects.Sprite;
    const door = self.registry.get("door") as Phaser.GameObjects.Sprite;
    const swan = self.registry.get("swan") as Phaser.GameObjects.Sprite;
    const easel=self.registry.get("easel")as Phaser.GameObjects.Sprite;
    const mailbox = self.registry.get("mailbox") as Phaser.GameObjects.Sprite;
    const updatedShowInvite = useHomeStore.getState().showInvitePopup;
    const updatedShowMail = useHomeStore.getState().showMailPopup;
    const updatedShowEasel = useHomeStore.getState().showEaselPopup;
    const updatedShowHelp = useHomeStore.getState().showHelpPopup;
    const otherPlayers = useMultiplayerStore.getState().otherPlayers;

    if (otherPlayers.size > 0 && this.frameCounter >= FRAME_BUFFER) {
      this.frameCounter = 0;
      
      updateOtherPlayers(this, otherPlayers);
    }

    this.frameCounter++;

    if (this.hostUsername==this.username){
// ADD CONDITIONS TO PHASER EVENTS
    }
    self.physics.add.overlap(player, mailbox, () => {
      const keyObj = self.input.keyboard!.addKey("Enter");
      const isDown = keyObj.isDown;
    });

    self.physics.add.overlap(player, easel, () => {
      const keyObj = self.input.keyboard!.addKey("Enter");
      const isDown = keyObj.isDown;
    });


    // detect overlap between player and door
    self.physics.add.overlap(player, door, () => {
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
    });

    // checks if player is overlapping with door
    const isOverlappingDoor = self.physics.world.overlap(player, door);
    const isOverlappingSwan = self.physics.world.overlap(player, swan);
    const isOverlappingMail=self.physics.world.overlap(player,mailbox)
    const isOverlappingEasel=self.physics.world.overlap(player,easel)

    // displays enter house text when overlapping
    if (isOverlappingDoor && !updatedShowInvite && !updatedShowMail && !updatedShowEasel && !updatedShowHelp  && this.hostUsername==this.username) {
      useHomeStore.setState({ text: "Press [Enter] to enter" });
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;

      // enters house when enter key is pressed
      if (isDown && !updatedShowInvite && !updatedShowMail && !updatedShowEasel && !updatedShowHelp && this.hostUsername==this.username) {
        
        this.scene.stop("exterior");
        this.scene.start("interior");
        // this.game.destroy(true);
        useHomeStore.setState({ text: "" });
      }
    } else if (isOverlappingSwan && !updatedShowInvite && !updatedShowMail && !updatedShowEasel && !updatedShowHelp  && this.hostUsername==this.username) {
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
      useHomeStore.setState({ text: "Press [Enter] to travel" });
      if (isDown) {
        useHomeStore.getState().showPopup("invite");
      }
    } else if (isOverlappingMail && !updatedShowInvite && !updatedShowMail && !updatedShowEasel && !updatedShowHelp  && this.hostUsername==this.username){
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
      useHomeStore.setState({ text: "Press [Enter] to open mailbox" });
      if (isDown) {
        useHomeStore.getState().showPopup("mail");
      }
    } else if (isOverlappingEasel && !updatedShowInvite && !updatedShowMail && !updatedShowEasel && !updatedShowHelp  && this.hostUsername==this.username){
      const keyObj = self.input.keyboard!.addKey("Enter"); // Get key object
      const isDown = keyObj.isDown;
      useHomeStore.setState({ text: "Press [Enter] to paint" });
      if (isDown) {
        useHomeStore.getState().showPopup("easel");
      }
    }
    else {
      useHomeStore.setState({ text: "" });
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

    sendPositionData(this, player);
  }
}
