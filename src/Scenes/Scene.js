class sceneName extends Phaser.Scene {
    constructor() {
      super("sceneKey");
    }
  
    init() {
      this.tileset = {
        name: "terrain", // name of tileset when added to Tiled (see Tile tutorial linked in README)
        key: "terrain-tiles", // tilesheet key defined in load.js (or wherever)
        tileWidth: 64,
        tileHeight: 64,
      };
      this.scaleFactor = 10; // Controls the "zoom" of the noise
      this.seed = Math.random(); // Initial seed
      noise.seed(this.seed); // ✅ This sets the global noise generator seed
    }
  
    create() {
      console.log("Scene loaded");
  
      //*** Displaying Tiled layers ***//
      const layer_map = this.add.tilemap("map"); // this is referencing the key to our Tiled JSON file
      const layer_tilesheet = layer_map.addTilesetImage(
        this.tileset.name,
        this.tileset.key
      );
  
      this.input.keyboard.on("keydown-R", () => {
          console.log("Pressed R — regenerating map...");
          this.seed = Math.random();
          console.log("seed:", this.seed);
          noise.seed(this.seed);
          this.generateMap();
        });
        
  
      this.input.keyboard.on("keydown-COMMA", () => {
        this.scaleFactor *= 1.2;
        this.generateMap();
      });
  
      this.input.keyboard.on("keydown-PERIOD", () => {
        this.scaleFactor *= 0.8;
        this.generateMap();
      });
  
      // load layers from Tiled t o scene
      //      NOTE: by default, the layers will render in the order you define them
      //            (so here, terrain is loaded, then decor is placed above it)
      //            See Phaser documentation for how to change layer order!
      const terrainLayer = layer_map.createLayer(
        "terrain-layer",
        layer_tilesheet,
        0,
        0
      );
      const decorLayer = layer_map.createLayer(
        "decor-layer",
        layer_tilesheet,
        0,
        0
      );
  
      //*** Making a map from a 2D grid ***//
      const tilegrid = [
        [122, 123, 123, 122, 123],
        [123, -1, 122, -1, 123],
        [122, 123, 122, 123, -1],
        [123, 122, 122, 123, -1],
        [-1, 123, -1, -1, 123],
      ];
  
      // Create a  tilemap
      const my_map = this.make.tilemap({
        data: tilegrid,
        tileWidth: this.tileset.tileWidth, // width and height, in pixels, of individual tiles
        tileHeight: this.tileset.tileHeight,
      });
  
      // Add the tileset to the map
      const tileset = my_map.addTilesetImage(this.tileset.name, this.tileset.key);
  
      // Create a layer from the map
      const [startX, startY] = [900, 50];
      const myLayer = my_map.createLayer(0, tileset, startX, startY);
  
      //*** Dynamically add tiles to map ***/
      const [dynWidth, dynHeight] = [10, 10]; // in tiles
      this.dyn_map = this.make.tilemap({
        tileWidth: this.tileset.tileWidth,
        tileHeight: this.tileset.tileHeight,
        width: dynWidth,
        height: dynHeight,
      });
  
      this.dyn_tileset = this.dyn_map.addTilesetImage(
        this.tileset.name,
        this.tileset.key
      );
  
      // note: layer is needed for display
      this.dyn_layer = this.dyn_map.createBlankLayer(
        "layer1",
        this.dyn_tileset,
        startX,
        startY + 400
      );
      this.dyn_layer.setScale(0.5); // see Phaser docs for more layer transformations!
  
      const numTiles = this.dyn_tileset.total; // total number of tiles in tileset
      for (let y = 0; y < this.dyn_map.height; y++) {
        for (let x = 0; x < this.dyn_map.width; x++) {
          let nx = x / this.scaleFactor;
          let ny = y / this.scaleFactor;
          let value = noise.perlin2(nx, ny);
  
          let tileIndex;
          if (value < -0.2) {
            tileIndex = 0; // water
          } else if (value < 0.2) {
            tileIndex = 5; // grass
          } else {
            tileIndex = 10; // mountains or forest
          }
  
          this.dyn_map.putTileAt(tileIndex, x, y);
        }
      }
    }
  
    update() {}
  
    generateMap() {
      for (let y = 0; y < this.dyn_map.height; y++) {
        for (let x = 0; x < this.dyn_map.width; x++) {
          let nx = x / this.scaleFactor;
          let ny = y / this.scaleFactor;
          let value = noise.perlin2(nx, ny);
    
          let tileIndex;
          if (value < -0.2) {
            tileIndex = 0; // water
          } else if (value < 0.2) {
            tileIndex = 5; // grass
          } else {
            tileIndex = 10; // mountains
          }
    
          this.dyn_layer.putTileAt(tileIndex, x, y); // 🔥 key fix here
        }
      }
    }
    
  }
  