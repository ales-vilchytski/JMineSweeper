var Game = require('game').Game;

this.globals = {
	preferences : new Preferences('by.ales.minesweeper.Main')
};

var game = new Game(globals.preferences);
game.start();
