import Phaser from "./phaser.js";

export default class MainMenu extends Phaser.Scene {
  isTouch = false;
  firstClick = false;
  constructor() {
    super("mainMenu");
  }

  preload() {}

  create() {
    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x999999
      )
      .setOrigin(0, 0);
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 4,
        "DungeonCrawler",
        {
          aling: "center",
          resolution: 0,
          fontSize: 16,
        }
      )
      .setOrigin(0.5, 0.5);

    const play = this.add
      .text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Play", {
        aling: "center",
        resolution: 1,
        fontSize: 24,
      })
      .setOrigin(0.5, 0.5);

    play
      .setInteractive()
      .input.hitArea.setTo(-16, -16, play.width + 16, play.height + 16);

    play.on("pointerover", () => {
      play.setTint(0xff0000);
    });
    play.on("pointerout", () => {
      play.setTint(0xffffff);
    });

    window.addEventListener("touchstart", () => {
      this.isTouch = true;
    });

    play.on("pointerdown", () => {
      if (!this.firstClick) {
        this.firstClick = true;
      } else {
        if (this.isTouch) {
          this.scene.start("floor1", { isTouch: true });
        } else if (!this.isTouch)
          this.scene.start("floor1", { isTouch: false });
      }
    });
  }
}
