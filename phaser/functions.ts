import { Scene } from "phaser";
import { PlayerInfo } from "./types";
import { useMultiplayerStore } from "./stores";

/**
 * Load in all of the player sprites.
 *
 * **NOTE: You only need to use this in a preload lifecycle event in one scene. However, feel free to use them in each.**
 *
 * @param scene The scene you want to use this function in.
 */
export default function loadSprites(scene: Phaser.Scene) {
  scene.load.spritesheet("cow", "/players/cow.png", {
    frameWidth: 100,
    frameHeight: 119,
  });
  scene.load.spritesheet("bear", "/players/bear.png", {
    frameWidth: 100,
    frameHeight: 109,
  });
  scene.load.spritesheet("panda", "/players/panda.png", {
    frameWidth: 100,
    frameHeight: 110,
  });
  scene.load.spritesheet("pig", "/players/pig.png", {
    frameWidth: 112,
    frameHeight: 110,
  });
  scene.load.spritesheet("bunny", "/players/bunny.png", {
    frameWidth: 80,
    frameHeight: 110,
  });
  scene.load.spritesheet("penguin", "/players/penguin.png", {
    frameWidth: 81.7,
    frameHeight: 122,
  });
  scene.load.spritesheet("cat", "/players/cat.png", {
    frameWidth: 70,
    frameHeight: 114,
  });
  scene.load.spritesheet("sheep", "/players/sheep.png", {
    frameWidth: 100,
    frameHeight: 114,
  });
  scene.load.spritesheet("beaver", "/players/beaver.png", {
    frameWidth: 100,
    frameHeight: 133,
  });
  scene.load.spritesheet("duck", "/players/duck.png", {
    frameWidth: 75,
    frameHeight: 122,
  });
  scene.load.spritesheet("hedgehog", "/players/hedgehog.png", {
    frameWidth: 100,
    frameHeight: 118,
  });
  scene.load.spritesheet("shiba", "/players/shiba.png", {
    frameWidth: 75,
    frameHeight: 122,
  });

    scene.load.on('progress', function (value: any) {

  });


    scene.load.on('fileprogress', function (file: { src: any; }) {

  });

  }
