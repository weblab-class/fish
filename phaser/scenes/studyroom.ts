import { Scene } from "phaser";

import loadSprites from "../functions";

/**
 * The study room in scene `/home`.
 */
export default class studyroom extends Scene {
  constructor() {
    super("studyroom");
  }

  preload() {
    // load backgrounds
    this.load.image("blackBg", "/backgrounds/blackBg.jpeg");
    this.load.image("studyroom", "/backgrounds/studyroom.png");
  }

  create() {
    // set backgrounds
    this.add.image(0, 0, "blackBg").setOrigin(0);
    this.add.image(750, 440, "studyroom");
  }
}
