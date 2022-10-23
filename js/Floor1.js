import Phaser from "./phaser.js";

import HornDude from "./HornDude.js";
import Player from "./Player.js";

import { sceneEvents } from "./EventsCenter.js";
import CoinPickup from "./coinPickup.js";
import HeartPickup from "./HeartPickup.js";

export default class Floor1 extends Phaser.Scene {
  cursors;
  isTouch = false;

  player;
  playerEnemyCollider;

  hornDudes;
  trophy;
  knives;

  coins;
  hearts;

  rooms;

  constructor() {
    super("floor1");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  init(data) {
    this.isTouch = data.isTouch;
  }

  create() {
    const map = this.make.tilemap({ key: "floor1" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("ground", tileset);

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    this.coins = this.physics.add.group({
      classType: CoinPickup,
    });

    this.hearts = this.physics.add.group({
      classType: HeartPickup,
    });

    this.player = new Player(this, 176 / 2, 112 / 2, "player");
    this.player.setKnives(this.knives);
    this.player.body.onCollide = true;

    this.scene.run("game-ui", {
      coins: this.player.coins,
      health: this.player.currentHealth,
    });

    this.hornDudes = this.physics.add.group({
      classType: HornDude,
      createCallback: (gameObject) => {
        gameObject.body.onCollide = true;
      },
    });

    this.trophy = this.physics.add.sprite(264, 168, "trophy");
    this.trophy.visible = false;

    const wallsLayer = map.createLayer("walls", tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    const obstaclesLayer = map.createLayer("obstacles", tileset);
    obstaclesLayer.setCollisionByProperty({ collides: true });
    obstaclesLayer.visible = false;

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.hornDudes, wallsLayer);
    const activeObstacles = this.physics.add.collider(
      this.player,
      obstaclesLayer
    );

    activeObstacles.active = false;
    this.physics.add.collider(this.hornDudes, obstaclesLayer);
    this.physics.add.collider(this.knives, wallsLayer, (knife) => {
      knife.destroy();
    });
    this.physics.add.collider(this.knives, obstaclesLayer, (knife) => {
      knife.destroy();
    });

    this.physics.add.collider(this.coins, this.player, (player, coin) => {
      this.player.addCoin();
      coin.destroy();
    });

    this.physics.add.collider(this.hearts, this.player, (player, heart) => {
      this.player.addHealth();
      heart.destroy();
    });

    this.physics.add.collider(
      this.knives,
      this.hornDudes,
      (knife, hornDude) => {
        knife.destroy();
        hornDude.destroy();
      }
    );

    this.playerEnemyCollider = this.physics.add.collider(
      this.hornDudes,
      this.player,
      (player, enemy) => {
        const directionX = this.player.x - enemy.x;
        const directionY = this.player.y - enemy.y;

        const direction = new Phaser.Math.Vector2(directionX, directionY)
          .normalize()
          .scale(100);

        this.player.handleDamage(direction);

        sceneEvents.emit("player-health-changed", this.player.currentHealth);

        if (this.player.currentHealth <= 0) {
          this.playerEnemyCollider.destroy();
        }
      }
    );

    const trophyTrigger = this.physics.add.overlap(
      this.trophy,
      this.player,
      () => {
        this.scene.start("floor2", {
          player: this.player,
          isTouch: this.isTouch,
        });
      }
    );
    trophyTrigger.active = false;

    this.createRooms(activeObstacles, obstaclesLayer, trophyTrigger);

    if (this.isTouch)
      this.scene.run("touch-ui", {
        cursors: this.cursors,
      });
  }

  update() {
    this.player.update(this.cursors);
  }

  createRooms(activeObstacles, obstaclesLayer, trophyTrigger) {
    this.rooms = this.add.group({
      classType: Phaser.GameObjects.Zone,
      in: false,
      cleared: false,
    });

    const room0 = this.rooms.get(16, 16, 144, 80).setOrigin(0, 0);
    const room1 = this.rooms.get(16, 128, 144, 80).setOrigin(0, 0);
    const room2 = this.rooms.get(192, 128, 144, 80).setOrigin(0, 0);

    this.physics.world.enable(room0);
    this.physics.world.enable(room1);
    this.physics.world.enable(room2);

    this.physics.add.overlap(room0, this.player, () => {
      if (!room0.in) {
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;
        room0.in = true;
        room1.in = false;
        room2.in = false;
      }
    });

    this.physics.add.overlap(room1, this.player, () => {
      if (!room1.in) {
        if (!room1.hornDude && !room1.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room1.hornDude = this.hornDudes.get(32, 160, "hornDude");
        }
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 112;
        room0.in = false;
        room1.in = true;
        room2.in = false;
      }

      if (!room1.cleared && !room1.hornDude.active) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room1.cleared = true;
      }
    });

    this.physics.add.overlap(room2, this.player, () => {
      if (!room2.in) {
        if (!room2.hornDude1 && !room2.hornDude2 && !room2.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room2.hornDude1 = this.hornDudes.get(304, 154, "hornDude");
          room2.hornDude2 = this.hornDudes.get(304, 176, "hornDude");
        }
        this.cameras.main.scrollX = 176;
        this.cameras.main.scrollY = 112;
        room0.in = false;
        room1.in = false;
        room2.in = true;
      }

      if (
        !room2.cleared &&
        !room2.hornDude1.active &&
        !room2.hornDude2.active
      ) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room2.cleared = true;
        this.trophy.visible = true;
        trophyTrigger.active = true;
      }
    });
  }
}
