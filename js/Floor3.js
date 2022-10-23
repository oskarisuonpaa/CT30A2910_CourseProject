import Phaser from "./phaser.js";
import HornDude from "./HornDude.js";
import ShieldDude from "./ShieldDude.js";
import Player from "./Player.js";
import { sceneEvents } from "./EventsCenter.js";
import CoinPickup from "./coinPickup.js";
import HeartPickup from "./HeartPickup.js";

export default class Floor3 extends Phaser.Scene {
  cursors;
  isTouch = false;

  player;
  playerHornDudeCollider;
  playerShieldDudeCollider;

  hornDudes;
  shieldDudes;
  trophy;
  knives;

  coins;
  hearts;

  rooms;
  constructor() {
    super("floor3");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  init(data) {
    this.isTouch = data.isTouch;
    this.playerCoins = data.player.coins;
    this.health = data.player.currentHealth;
  }

  create() {
    const map = this.make.tilemap({ key: "floor3" });
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
    this.player.currentHealth = this.health;
    this.player.coins = this.playerCoins;

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

    this.shieldDudes = this.physics.add.group({
      classType: ShieldDude,
      createCallback: (gameObject) => {
        gameObject.body.onCollide = true;
      },
    });

    this.trophy = this.physics.add.sprite(88, 280, "trophy");
    this.trophy.visible = false;

    const wallsLayer = map.createLayer("walls", tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    const obstaclesLayer = map.createLayer("obstacles", tileset);
    obstaclesLayer.setCollisionByProperty({ collides: true });
    obstaclesLayer.visible = false;

    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.hornDudes, wallsLayer);
    this.physics.add.collider(this.shieldDudes, wallsLayer);
    const activeObstacles = this.physics.add.collider(
      this.player,
      obstaclesLayer
    );

    activeObstacles.active = false;
    this.physics.add.collider(this.hornDudes, obstaclesLayer);
    this.physics.add.collider(this.shieldDudes, obstaclesLayer);
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
    this.physics.add.collider(
      this.knives,
      this.shieldDudes,
      (knife, shieldDude) => {
        knife.destroy();
        shieldDude.health -= 1;
        if (shieldDude.health <= 0) {
          shieldDude.destroy();
        }
      }
    );

    this.playerHornDudeCollider = this.physics.add.collider(
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
          this.playerHornDudeCollider.destroy();
        }
      }
    );

    this.playerShieldDudeCollider = this.physics.add.collider(
      this.shieldDudes,
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
          this.playerShieldDudeCollider.destroy();
        }
      }
    );

    const trophyTrigger = this.physics.add.overlap(
      this.trophy,
      this.player,
      () => {
        this.scene.start("gameWonScene", {
          score: this.player.coins,
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
    const room1 = this.rooms.get(192, 16, 144, 80).setOrigin(0, 0);
    const room2 = this.rooms.get(368, 16, 144, 80).setOrigin(0, 0);
    const room3 = this.rooms.get(368, 128, 144, 80).setOrigin(0, 0);
    const room4 = this.rooms.get(192, 128, 144, 80).setOrigin(0, 0);
    const room5 = this.rooms.get(16, 128, 144, 80).setOrigin(0, 0);
    const room6 = this.rooms.get(16, 128 + 112, 144, 80).setOrigin(0, 0);

    this.physics.world.enable(room0);
    this.physics.world.enable(room1);
    this.physics.world.enable(room2);
    this.physics.world.enable(room3);
    this.physics.world.enable(room4);
    this.physics.world.enable(room5);
    this.physics.world.enable(room6);

    this.physics.add.overlap(room0, this.player, () => {
      if (!room0.in) {
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 0;
        room0.in = true;
      }
    });

    this.physics.add.overlap(room1, this.player, () => {
      if (!room1.in) {
        if (!room1.hornDude && !room1.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room1.hornDude = this.hornDudes.get(328, 112 / 2, "hornDude");
        }
        if (room0.in) {
          this.player.x = 200;
          this.player.y = 112 / 2;
        } else {
          this.player.x = 328;
          this.player.y = 112 / 2;
        }
        this.cameras.main.scrollX = 176;
        this.cameras.main.scrollY = 0;
        room0.in = false;
        room1.in = true;
        room2.in = false;
        room3.in = false;
        room4.in = false;
        room5.in = false;
        room6.in = false;
      }

      if (!room1.cleared && !room1.hornDude.active) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room1.cleared = true;
      }
    });

    this.physics.add.overlap(room2, this.player, () => {
      if (!room2.in) {
        if (!room2.shieldDude && !room2.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room2.shieldDude = this.shieldDudes.get(440, 112 / 2, "shieldDude");
        }
        if (room1.in) {
          this.player.x = 376;
          this.player.y = 112 / 2;
        } else {
          this.player.x = 440;
          this.player.y = 88;
        }
        this.cameras.main.scrollX = 352;
        this.cameras.main.scrollY = 0;
        room0.in = false;
        room1.in = false;
        room2.in = true;
        room3.in = false;
        room4.in = false;
        room5.in = false;
        room6.in = false;
      }

      if (!room2.cleared && !room2.shieldDude.active) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room2.cleared = true;
      }
    });

    this.physics.add.overlap(room3, this.player, () => {
      if (!room3.in) {
        if (!room3.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room3.heart = this.hearts.get(408, 168, "heart-pickup");
          room3.coin = this.coins.get(486, 168, "coin-pickup");
        }
        if (room2.in) {
          this.player.x = 440;
          this.player.y = 136;
        } else {
          this.player.x = 440;
          this.player.y = 200;
        }
        this.cameras.main.scrollX = 352;
        this.cameras.main.scrollY = 112;
        room0.in = false;
        room1.in = false;
        room2.in = false;
        room3.in = true;
        room4.in = false;
        room5.in = false;
        room6.in = false;
      }

      if (!room3.cleared) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room3.cleared = true;
      }
    });

    this.physics.add.overlap(room4, this.player, () => {
      if (!room4.in) {
        if (!room4.cleared) {
          activeObstacles.active = true;
          obstaclesLayer.visible = true;
          room4.hornDude1 = this.hornDudes.get(200, 136, "hornDude");
          room4.hornDude2 = this.hornDudes.get(200, 200, "hornDude");
        }
        if (room3.in) {
          this.player.x = 328;
          this.player.y = 112 / 2 + 112;
        } else {
          this.player.x = 200;
          this.player.y = 112 / 2 + 112;
        }
        this.cameras.main.scrollX = 176;
        this.cameras.main.scrollY = 112;
        room0.in = false;
        room1.in = false;
        room2.in = false;
        room3.in = false;
        room4.in = true;
        room5.in = false;
        room6.in = false;
      }

      if (
        !room4.cleared &&
        !room4.hornDude1.active &&
        !room4.hornDude2.active
      ) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room4.cleared = true;
      }
    });

    this.physics.add.overlap(room5, this.player, () => {
      if (!room5.in) {
        if (!room5.cleared) {
          room5.coin = this.coins.get(72, 168, "coin-pickup");
          room5.heart = this.coins.get(100, 168, "heart-pickup");
        }
        if (room4.in) {
          this.player.x = 148;
          this.player.y = 112 / 2 + 112;
        } else {
          this.player.x = 86;
          this.player.y = 200;
        }
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 112;
        room0.in = false;
        room1.in = false;
        room2.in = false;
        room3.in = false;
        room4.in = false;
        room5.in = true;
        room6.in = false;
      }

      if (!room5.cleared) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room5.cleared = true;
      }
    });

    this.physics.add.overlap(room6, this.player, () => {
      if (!room6.in) {
        if (!room6.cleared) {
          room6.shieldDude1 = this.shieldDudes.get(38, 312, "shieldDude");
          room6.shieldDude2 = this.shieldDudes.get(138, 312, "shieldDude");
        }
        if (room5.in) {
          this.player.x = 86;
          this.player.y = 248;
        }
        this.cameras.main.scrollX = 0;
        this.cameras.main.scrollY = 224;
        room0.in = false;
        room1.in = false;
        room2.in = false;
        room3.in = false;
        room4.in = false;
        room5.in = false;
        room6.in = true;
      }
      if (
        !room6.cleared &&
        !room6.shieldDude1.active &&
        !room6.shieldDude2.active
      ) {
        activeObstacles.active = false;
        obstaclesLayer.visible = false;
        room6.cleared = true;
        this.trophy.visible = true;
        trophyTrigger.active = true;
      }
    });
  }
}
