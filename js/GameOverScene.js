import Phaser from "./phaser.js";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("gameOverScene");
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    this.add.rectangle(176 / 2, 112 / 2, 176, 112, 0x000000);
    this.add.text(176 / 2, 112 / 4, "Game Over").setOrigin(0.5, 0.5);
    this.add.text(176 / 2, 112 / 2, `Score: ${this.score}`).setOrigin(0.5, 0.5);
  }
}
