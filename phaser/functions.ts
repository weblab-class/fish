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
export function loadSprites(scene: Phaser.Scene) {
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

  scene.load.on("progress", function (value: any) {});

  scene.load.on("fileprogress", function (file: { src: any }) {});
}

export function updateOtherPlayers(
  scene: Scene,
  otherPlayers: Map<string, PlayerInfo>,
) {
  const currentPlayers: Map<string, true> = new Map(); // we don't use value, but just the map key for O(1) access

  // update existing players
  for (const [otherUid, otherInfo] of Array.from(otherPlayers)) {
    const playerKey = `player-${otherUid}-${scene.scene.key}`;

    const otherSprite = scene.registry.get(playerKey) as
      | Phaser.GameObjects.Sprite
      | undefined;
    if (otherSprite) {
      // if (otherSprite.x !== otherInfo.x || otherSprite.y !== otherInfo.y) {
      //   otherSprite.anims.play(`move-${otherUid}`, true);
      // }
      // else {
      //   otherSprite.anims.play(`turn-${otherUid}`);
      // }

      otherSprite.setPosition(otherInfo.x, otherInfo.y);

    } else {
      // joined players
      const newPlayerSprite = scene.add.sprite(otherInfo.x, otherInfo.y, otherInfo.sprite);
      // scene.anims.create({
      //   key: `move-${otherUid}`,
      //   frames: scene.anims.generateFrameNumbers(otherInfo.sprite, {
      //     start: 0,
      //     end: 1,
      //   }),
      //   frameRate: 10,
      //   repeat: -1,
      // });
      // scene.anims.create({
      //   key: `turn-${otherUid}`,
      //   frames: [{ key: otherInfo.sprite, frame: 0 }],
      //   frameRate: 20,
      // });

      scene.registry.set(
        playerKey,
        newPlayerSprite,
      );
    }

    currentPlayers.set(playerKey, true);
  }

  const registryOthers = Object.getOwnPropertyNames(
    scene.registry.getAll(),
  ).filter((key) => key.startsWith("player-"));

  // delete people who have left
  for (const regPlayerKey of registryOthers) {
    if (currentPlayers.has(regPlayerKey)) continue;

    const oldSprite = scene.registry.get(
      regPlayerKey,
    ) as Phaser.GameObjects.Sprite;
    scene.registry.remove(regPlayerKey);

    oldSprite.destroy(true);
  }
}

export function sendPositionData(player: Phaser.GameObjects.Sprite) {
  // stores current player's location
  const x = player.x;
  const y = player.y;

  // stores current player's previous location
  const oldPosition = player.data?.get("oldPosition") as
    | { x: number; y: number }
    | undefined;

  // checks if position changed and if we are in multiplayer mode
  if (
    (!oldPosition ||
      (oldPosition && (x !== oldPosition.x || y !== oldPosition.y))) &&
    useMultiplayerStore.getState().otherPlayers.size > 0
  ) {
    // send data to everyone
    useMultiplayerStore.getState().sendMyData({});
  }

  // saves old position
  player.data?.set("oldPosition", {
    x,
    y,
  });
}
