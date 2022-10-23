import Phaser from "./phaser.js";
import { sceneEvents } from "./EventsCenter.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  healthState = 0;
  damageTime = 0;

  speed = 50;

  currentHealth = 3;
  maxHealth = 3;
  coins = 0;

  knives;
  direction;

  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  addCoin() {
    this.coins += 1;
    sceneEvents.emit("player-coins-changed", this.coins);
  }

  addHealth() {
    if (this.currentHealth === this.maxHealth) return;

    this.currentHealth += 1;

    sceneEvents.emit("player-health-changed", this.currentHealth);
  }

  throwKnife() {
    const vec = new Phaser.Math.Vector2(0, 0);

    this.direction = this.body.velocity;

    if (this.direction.x === 0 && this.direction.y >= 0) {
      //DOWN
      vec.y = 1;
    } else if (this.direction.x === 0 && this.direction.y < 0) {
      //UP
      vec.y = -1;
    } else if (this.direction.x < 0) {
      //LEFT
      vec.x = -1;
    } else if (this.direction.x > 0) {
      //RIGHT
      vec.x = 1;
    }

    const angle = vec.angle();
    const knife = this.knives.get(this.x, this.y, "weapon-knife");

    knife.setActive(true);
    knife.setVisible(true);

    knife.setRotation(angle);
    knife.setVelocity(vec.x * 200, vec.y * 200);
  }

  setKnives(knives) {
    this.knives = knives;
  }

  handleDamage(direction) {
    if (this.healthState === 1 || this.currentHealth <= 0) {
      return;
    }

    this.setVelocity(direction.x, direction.y);

    this.currentHealth--;

    if (this.currentHealth <= 0) {
      this.healthState = 2;
      this.setVelocity(0, 0);
    } else {
      this.setTint(0xff0000);

      this.healthState = 1;
      this.damageTime = 0;
    }
  }

  preUpdate(t, dt) {
    super.preUpdate();

    switch (this.healthState) {
      case 0:
        break;
      case 1:
        this.damageTime += dt;
        if (this.damageTime > 250) {
          this.healthState = 0;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  update(cursors) {
    if (this.healthState === 2) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.throwKnife();
      return;
    }

    if (this.healthState === 1) return;

    if (cursors.up.isDown && !cursors.down.isDown) {
      this.setVelocityY(-this.speed);
    } else if (cursors.down.isDown && !cursors.up.isDown) {
      this.setVelocityY(this.speed);
    } else {
      this.setVelocityY(0);
    }

    if (cursors.left.isDown && !cursors.right.isDown) {
      this.setVelocityX(-this.speed);
    } else if (cursors.right.isDown && !cursors.left.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    this.body.velocity.normalize().scale(this.speed);
  }
}
