import Phaser from "./phaser.js";
import Preloader from "./Preloader.js";
import MainMenu from "./MainMenu.js";
import Floor1 from "./Floor1.js";
import Floor2 from "./Floor2.js";
import Floor3 from "./Floor3.js";
import GameUI from "./GameUI.js";
import TouchUI from "./TouchUI.js";
import GameOverScene from "./GameOverScene.js";
import GameWonScene from "./GameWonScene.js";

const config = {
  type: Phaser.AUTO,
  width: 176,
  height: 112,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scene: [
    Preloader,
    MainMenu,
    Floor1,
    Floor2,
    Floor3,
    GameUI,
    TouchUI,
    GameOverScene,
    GameWonScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    zoom: 4,
  },
  autoCenter: Phaser.Scale.CENTER_BOTH,
};

export default new Phaser.Game(config);
