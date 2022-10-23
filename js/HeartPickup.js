import Phaser from "./phaser.js";

export default class HeartPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
}
