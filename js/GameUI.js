import Phaser from "./phaser.js";
import { sceneEvents } from "./EventsCenter.js";

export default class GameUI extends Phaser.Scene {
  coins = 0;
  health;

  constructor() {
    super({ key: "game-ui" });
  }

  init(data) {
    this.coins = data.coins;
    this.health = data.health;
  }

  create() {
    const coinsLabel = this.add.text(5, 16, `${this.coins}`);

    sceneEvents.on("player-coins-changed", (coins) => {
      coinsLabel.text = coins.toString();
      coins++;
    });

    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: { x: 10, y: 10, stepX: 8 },
      quantity: 3,
      setScale: { x: 0.5, y: 0.5 },
    });

    sceneEvents.on(
      "player-health-changed",
      this.handlePlayerHealthChanged,
      this
    );

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        "player-health-changed",
        this.handlePlayerHealthChanged,
        this
      );
      sceneEvents.off("player-coins-changed");
    });

    if (this.health !== 3) {
      this.handlePlayerHealthChanged(this.health);
    }
  }

  handleDeath() {
    this.scene.start("gameOverScene", { score: this.coins });
  }

  handlePlayerHealthChanged(health) {
    if (health <= 0) {
      this.handleDeath();
      return;
    }

    this.hearts.children.each((gameObject, index) => {
      if (index < health) {
        gameObject.setTexture("ui-heart-full");
      } else {
        gameObject.setTexture("ui-heart-empty");
      }
    });
  }
}
