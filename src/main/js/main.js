var Game = require('game').Game;
var Preferences = require('preferences').Preferences;

this.globals = {
	preferences : new Preferences('by.ales.minesweeper.Main')
};

var game = new Game(globals.preferences);
game.start();
