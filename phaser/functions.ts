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
    frameWidth: 82,
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

  scene.load.on("progress", function (value: any) {
    console.log("progress", value);
  });

  scene.load.on("fileprogress", function (file: { src: any }) {
    console.log("sprites", file.src);
  });
}

export function updateOtherPlayers(scene: Scene, otherPlayers: Map<string, PlayerInfo>) {
  const currentPlayers: Map<string, true> = new Map(); // we don't use value, but just the map key for O(1) access

  // update existing players
  for (const [otherUid, otherInfo] of Array.from(otherPlayers)) {
    const playerKey = `player-${otherUid}-${scene.scene.key}`;

    const otherSprite = scene.registry.get(playerKey) as
      | Phaser.GameObjects.Sprite
      | undefined;
    if (otherSprite) {
      otherSprite.setPosition(otherInfo.x, otherInfo.y);
      console.log(`updating ${otherInfo.username} in ${scene.scene.key}`, otherInfo);
      // TODO set anim based on current animation frame here
    } else {
      // joined players
      console.log(`joining ${otherInfo.username} in ${scene.scene.key}`, otherInfo);
      scene.registry.set(
        playerKey,
        scene.add.sprite(otherInfo.x, otherInfo.y, otherInfo.sprite),
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

    console.log(`deleting`);

    // !BUG Does not work
    const oldSprite = scene.registry.get(
      regPlayerKey,
    ) as Phaser.GameObjects.Sprite;
    scene.registry.remove(regPlayerKey);
    oldSprite.destroy(true); // TEST
  }
}

export function sendPositionData(scene: Scene, player: Phaser.GameObjects.Sprite) {
    // stores current player's location
    const x = player.x;
    const y = player.y;

    // stores current player's previous location
    const oldPosition = player.data?.get("oldPosition") as
      | { x: number; y: number }
      | undefined;

    // checks if position changed and if we are in multiplayer mode
    if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y) && useMultiplayerStore.getState().otherPlayers.size > 0) {
      // send data to everyone
      useMultiplayerStore.getState().sendMyData({ });
    }

    // saves old position
    player.data?.set("oldPosition", {
      x,
      y,
    });
}
