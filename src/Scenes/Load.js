// you can load assets in your play scene(s) following the steps you see below...
//      ...but for the sake of organization/readability, sometimes it's best to preload 
//      all assets in a separate scene. NOTE how, in main.js, we list this scene first
//      in the game config scene array, telling Phaser to load this scene first!
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // loading a Tiled tilesheet with tile map
        this.load.setPath("./assets/");                                 // relative path to your assets folder
        this.load.image("terrain-tiles", "mapPack_tilesheet.png");      // Tiled tilesheet  --> (YOUR_KEY_A, IMAGE_NAME)
        this.load.tilemapTiledJSON("map", "terrain map.json");          // Tiled JSON       --> (YOUR_KEY_B, FILE_NAME) 
        // NOTE: the keys you define above will be how you access this preloaded content in your scene(s)

        // loading individual tile images
  
    }

    create() {
        console.log("Load finished...");
        this.scene.start("sceneKey"); // start next scene
    }
}