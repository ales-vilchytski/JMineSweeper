var Game = require('game').Game;
var Preferences = require('preferences').Preferences;

this.globals = {
    preferences : new Preferences(
        java.util.prefs.Preferences.userNodeForPackage(
            java.lang.Class.forName('by.ales.minesweeper.Main')))
};

var game = new Game(globals.preferences,
        require('sweeper').Sweeper,
        require('main_window').MainWindow);
game.start();
