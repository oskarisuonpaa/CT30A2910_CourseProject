import Phaser from "./phaser.js";

const randomDirection = (exclude) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return newDirection;
};

export default class HornDude extends Phaser.Physics.Arcade.Sprite {
  direction;
  speed = 30;
  moveEvent;
  scene;
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;

    scene.physics.world.on("tilecollide", this.handleTileCollision, this);
    this.direction = randomDirection(4);

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  onDeath() {
    const random = Phaser.Math.Between(0, 2);
    if (random === 0) {
      this.scene.coins.get(this.x, this.y, "coin-pickup");
    } else if (random === 1) {
      this.scene.hearts.get(this.x, this.y, "heart-pickup");
    }
  }

  destroy() {
    this.onDeath();
    this.moveEvent.destroy();
    super.destroy();
  }

  handleTileCollision(gameObject, tile) {
    if (gameObject !== this) {
      return;
    }

    this.direction = randomDirection(this.direction);
  }

  preUpdate() {
    super.preUpdate();

    switch (this.direction) {
      case 0:
        this.body.setVelocity(0, -this.speed);
        break;
      case 1:
        this.body.setVelocity(0, this.speed);
        break;
      case 2:
        this.body.setVelocity(-this.speed, 0);
        break;
      case 3:
        this.body.setVelocity(this.speed, 0);
        break;
      default:
        break;
    }
  }
}
