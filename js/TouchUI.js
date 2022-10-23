import Phaser from "./phaser.js";

export default class TouchUI extends Phaser.Scene {
  constructor() {
    super({ key: "touch-ui" });
  }

  init(data) {
    this.cursors = data.cursors;
  }

  create() {
    const upTouch = this.add
      .rectangle(176 - 34, 112 - 34, 16, 16, 0x999999, 0.5)
      .setOrigin(0.5, 0.5);

    upTouch.setInteractive();

    upTouch.on("pointerover", () => {
      this.cursors.up.isUp = false;
      this.cursors.up.isDown = true;
    });

    upTouch.on("pointerout", () => {
      this.cursors.up.isDown = false;
      this.cursors.up.isUp = true;
    });

    const downTouch = this.add
      .rectangle(
        this.cameras.main.scrollX + 176 - 34,
        this.cameras.main.scrollY + 112 - 16,
        16,
        16,
        0x999999,
        0.5
      )
      .setOrigin(0.5, 0.5);

    downTouch.setInteractive();

    downTouch.on("pointerover", () => {
      this.cursors.down.isUp = false;
      this.cursors.down.isDown = true;
    });

    downTouch.on("pointerout", () => {
      this.cursors.down.isDown = false;
      this.cursors.down.isUp = true;
    });

    const rightTouch = this.add
      .rectangle(
        this.cameras.main.scrollX + 176 - 16,
        this.cameras.main.scrollY + 112 - 16,
        16,
        16,
        0x999999,
        0.5
      )
      .setOrigin(0.5, 0.5);

    rightTouch.setInteractive();

    rightTouch.on("pointerover", () => {
      this.cursors.right.isUp = false;
      this.cursors.right.isDown = true;
    });

    rightTouch.on("pointerout", () => {
      this.cursors.right.isDown = false;
      this.cursors.right.isUp = true;
    });

    const leftTouch = this.add
      .rectangle(
        this.cameras.main.scrollX + 176 - 52,
        this.cameras.main.scrollY + 112 - 16,
        16,
        16,
        0x999999,
        0.5
      )
      .setOrigin(0.5, 0.5);

    leftTouch.setInteractive();

    leftTouch.on("pointerover", () => {
      this.cursors.left.isUp = false;
      this.cursors.left.isDown = true;
    });

    leftTouch.on("pointerout", () => {
      this.cursors.left.isDown = false;
      this.cursors.left.isUp = true;
    });

    const shootTouch = this.add
      .rectangle(
        this.cameras.main.scrollX + 16,
        this.cameras.main.scrollY + 112 - 16,
        16,
        16,
        0x999999,
        0.5
      )
      .setOrigin(0.5, 0.5);

    shootTouch.setInteractive();

    shootTouch.on("pointerover", () => {
      this.cursors.space.isUp = false;
      this.cursors.space.isDown = true;
      this.cursors.space._justDown = true;
    });

    shootTouch.on("pointerout", () => {
      this.cursors.space.isDown = false;
      this.cursors.space.isUp = true;
      this.cursors.space._justDown = false;
    });
  }
}
