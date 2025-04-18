class sceneName extends Phaser.Scene {
  constructor() {
    super("sceneKey");
  }

  init() {
    this.tileset = {
      name: "terrain",
      key: "terrain-tiles",
      tileWidth: 64,
      tileHeight: 64,
    };
    this.scaleFactor = 10;
    this.seed = Math.random();
    noise.seed(this.seed);
    this.initTerrainTiles();
  }

  create() {
    console.log("Scene loaded");

    const layer_map = this.add.tilemap("map");
    const layer_tilesheet = layer_map.addTilesetImage(
      this.tileset.name,
      this.tileset.key
    );

    this.input.keyboard.on("keydown-R", () => {
      // console.log("Pressed R — regenerating map...");
      this.seed = Math.random();
      // console.log("seed:", this.seed);
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

    const [dynWidth, dynHeight] = [20, 20];
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

    this.dyn_layer = this.dyn_map.createBlankLayer(
      "layer1",
      this.dyn_tileset,
      900,
      450
    );
    this.dyn_layer.setScale(0.5);

    this.decor_layer = this.dyn_map.createBlankLayer(
      "decor-layer",
      this.dyn_tileset,
      900,
      450
    );
    this.decor_layer.setScale(0.5);

    this.generateMap();
  }

  update() {}

  initTerrainTiles() {
    this.SNOW = 86;
    this.ROCK = 28;
    this.GRASS = 23;
    this.SAND = 91;
    this.WATER = 203;

    this.SNOWTREE = 123;
    this.SNOWMAN = 105;
    this.TREE = 43;
    this.BUSH = 59;
    this.BOULDER = 42;

    // edges lifted stuff
    this.SNOW_EDGE = 51;
    this.GRASS_EDGE = 19;
    this.ROCK_EDGE = 21;
    this.SAND_EDGE = 17;

    this.terrain = [
      { height: 2.5, tiles: [this.SNOW], transitions: true },
      { height: 1.5, tiles: [this.ROCK], transitions: true },
      { height: 0.5, tiles: [this.GRASS], transitions: true },
      { height: -0.5, tiles: [this.SAND], transitions: true },
      { height: -Infinity, tiles: [this.WATER], edge:null },
    ];

    this.decor = [
      { height: 5.5, tiles: [this.SNOWMAN, this.SNOWTREE], prob: 0.1 },
      { height: 5, tiles: [this.SNOWTREE], prob: 0.15 },
      { height: 4, tiles: [this.SNOWTREE, this.BOULDER], prob: 0.1 },
      { height: 3, tiles: [this.BOULDER], prob: 0.01 },
      { height: 2, tiles: [this.TREE, this.BUSH], prob: 0.15 },
      { height: -1, tiles: [], prob: 0 },
    ];
  }

  generateMap() {
    this.dyn_layer.fill(-1);
    this.decor_layer.fill(-1);

    for (let y = 0; y < this.dyn_map.height; y++) {
      for (let x = 0; x < this.dyn_map.width; x++) {
        let nx = x / this.scaleFactor;
        let ny = y / this.scaleFactor;
        let value = noise.perlin2(nx, ny);
        // let heightValue = Phaser.Math.Clamp(value * 6, -6, 6);

        let heightValue = Math.pow(value + 1, 2.5) * 3 - 3;
        // or: let heightValue = value * 8;

        let baseTile = -1;
        for (let layer of this.terrain) {
          if (heightValue >= layer.height) {
            baseTile = Phaser.Math.RND.pick(layer.tiles);
            break;
          }
        }

        if (baseTile === -1 || typeof baseTile === "undefined") {
          console.warn(
            `No base tile selected at x:${x} y:${y}, defaulting to GRASS`
          );
          baseTile = this.GRASS;
        }

        this.dyn_layer.putTileAt(baseTile, x, y);

        for (let item of this.decor) {
          if (
            heightValue >= item.height &&
            item.tiles.length > 0 &&
            Math.random() < item.prob
          ) {
            const decorTile = Phaser.Math.RND.pick(item.tiles);
            this.decor_layer.putTileAt(decorTile, x, y);
            break;
          }
        }

        console.log(
          `x:${x} y:${y} value:${value.toFixed(2)} height:${heightValue.toFixed(
            2
          )} baseTile:${baseTile}`
        );
      }
    }
  }
}
