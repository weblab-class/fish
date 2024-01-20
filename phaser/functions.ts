// for preloading player sprites
function loadSprites(scence: Phaser.Scene) {
    scence.load.spritesheet("cow", "/players/cow.png", {
      frameWidth: 100,
      frameHeight: 119,
    });
    scence.load.spritesheet("bear", "/players/bear.png", {
      frameWidth: 100,
      frameHeight: 109,
    });
    scence.load.spritesheet("panda", "/players/panda.png", {
      frameWidth: 100,
      frameHeight: 110,
    });
    scence.load.spritesheet("pig", "/players/pig.png", {
      frameWidth: 112,
      frameHeight: 110,
    });
    scence.load.spritesheet("bunny", "/players/bunny.png", {
      frameWidth: 80,
      frameHeight: 110,
    });
    scence.load.spritesheet("penguin", "/players/penguin.png", {
      frameWidth: 82,
      frameHeight: 122,
    });
    scence.load.spritesheet("cat", "/players/cat.png", {
      frameWidth: 70,
      frameHeight: 114,
    });
    scence.load.spritesheet("sheep", "/players/sheep.png", {
      frameWidth: 100,
      frameHeight: 114,
    });
    scence.load.spritesheet("beaver", "/players/beaver.png", {
      frameWidth: 100,
      frameHeight: 133,
    });
    scence.load.spritesheet("duck", "/players/duck.png", {
      frameWidth: 75,
      frameHeight: 122,
    });
    scence.load.spritesheet("hedgehog", "/players/hedgehog.png", {
      frameWidth: 100,
      frameHeight: 118,
    });
    scence.load.spritesheet("shiba", "/players/shiba.png", {
      frameWidth: 75,
      frameHeight: 122,
    });
  }

  export default loadSprites;