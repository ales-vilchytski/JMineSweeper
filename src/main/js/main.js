var Game = require('game').Game;
var Preferences = require('preferences').Preferences;

this.globals = {
	preferences : new Preferences(
	        java.util.prefs.Preferences.userNodeForPackage(_mainClass))
};

var game = new Game(globals.preferences);
game.start();
