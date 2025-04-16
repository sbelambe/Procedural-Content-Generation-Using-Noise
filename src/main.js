"use strict" // debug with extreme prejudice

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1280,
    height: 800,
    scene: [Load, sceneName]
}

// you can define global variables here
const GAME = new Phaser.Game(config);
const GLOBAL = "I am a global variable :)"