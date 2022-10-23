import Phaser from "./phaser.js";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    //LOAD SCENE TILES
    this.load.image("tiles", "assets/tiles/dungeonTileset.png");
    this.load.tilemapTiledJSON("floor1", "assets/tiles/floor1.json");
    this.load.tilemapTiledJSON("floor2", "assets/tiles/floor2.json");
    this.load.tilemapTiledJSON("floor3", "assets/tiles/floor3.json");
    //LOAD ENTITIES
    this.load.image("player", "assets/sprites/Player.png");
    this.load.image("hornDude", "assets/sprites/HornDude.png");
    this.load.image("shieldDude", "assets/sprites/ShieldDude.png");
    //LOAD UI
    this.load.image("ui-heart-full", "assets/ui/heartFull.png");
    this.load.image("ui-heart-half-full", "assets/ui/heartHalfFull.png");
    this.load.image("ui-heart-empty", "assets/ui/heartEmpty.png");
    //LOAD WEAPONS
    this.load.image("weapon-knife", "assets/weapons/weaponKnife.png");
    //LOAD PICKUPS
    this.load.image("coin-pickup", "assets/pickups/coinPickup.png");
    this.load.image("heart-pickup", "assets/pickups/heartPickup.png");
    this.load.image("trophy", "assets/pickups/Trophy.png");
  }
  create() {
    this.scene.start("mainMenu");
  }
}
