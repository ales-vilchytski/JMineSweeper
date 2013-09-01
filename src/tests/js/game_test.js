var Game = require('game').Game;
var Event = require('lib/util').Event;
var beanMock = require('lib/test_util').beanMock;
var assert = require('assert');

var currentMainWindow = null; //static var with last created mainWindow

//========= mocks ==============
this.MainWindowMock = function() {
	this.SettingsWindow = beanMock({
		Settings : 'mock', 
		SettingsChangedEvent : new Event(), 
	});
	this.NewGameEvent = new Event();
	this.Sweeper = null;
	this.CellSize = null;
	this.FontSize = null;
	this.Scores = null;
	this.Score = null;
	this.Showed = false;
	this.EnterNameDialogShowed = false;
	
	this.show = function(sweeper, cellSize, fontSize) {
		this.Showed = true;
		this.Sweeper = sweeper;
		this.CellSize = cellSize;
		this.FontSize = fontSize;
	};
	this.showEnterNameDialog = function(scores, score) {
		this.EnterNameDialogShowed = true;
		this.Scores = scores;
		this.Score = score;
		return 'ohMyName';
	};
	
	beanMock(this);
	currentMainWindow = this;
};

var currentSweeper = null; //static var with last created sweeper

this.SweeperMock = function(x, y, mines) {
	this.GameFinishedEvent = new Event();
	this.X = x;
	this.Y = y;
	this.Seconds = 5;
	this.Mines = mines;
	this.Disposed = false;
	
	this.dispose = function() { this.Disposed = true; };
	
	beanMock(this);
	currentSweeper = this;
};

//===========================
//========= tests ===========

var preferences = null;
var game = null;

function setUp() {
    currentSweeper = null;
    currentMainWindow = null;
    preferences = beanMock({
        X : 3,
        Y : 3,
        Mines : 1,
        Scores : [],
        CellSize : 10,
        FontSize : 10
    });

    game = new Game(preferences, SweeperMock, MainWindowMock);
};

exports['test creation of sweeper and main window'] = function() {
    setUp();
    
    game.start();

    assert.notEqual(currentSweeper, null);
    assert.notEqual(currentMainWindow, null);

    assert.equal(currentSweeper.X, preferences.X);
    assert.equal(currentSweeper.Y, preferences.Y);
    assert.equal(currentSweeper.Mines, preferences.Mines);
    assert.equal(currentSweeper.Seconds, 5);

    assert.equal(currentMainWindow.CellSize, preferences.CellSize);
    assert.equal(currentMainWindow.FontSize, preferences.FontSize);
    assert.equal(currentMainWindow.Sweeper, currentSweeper);
};

exports['test main window show on start'] = function() {
    setUp();
    
    game.start();

    assert.ok(currentMainWindow.Showed);
};

exports['test disposing sweeper'] = function() {
    setUp();
    
    game.start(); //force creation of 1st sweeper
    
    var prevSweeper = currentSweeper;
    game.start(); //force creation of 2nd sweeper
    
    assert.notEqual(currentSweeper, prevSweeper);
    assert.ok(prevSweeper.Disposed);
};

exports['test new game event handling'] = function() {
    setUp();
    
    currentMainWindow.NewGameEvent.fire();

    // to check if new game created change preferences and check new values
    //and check creation of new sweeper
    var x = preferences.X + 1;
    var cellSize = preferences.CellSize + 10;
    preferences.setX(x);
    preferences.setCellSize(cellSize);
    var prevSweeper = currentSweeper;

    currentMainWindow.NewGameEvent.fire();

    assert.equal(currentSweeper.X, x);
    assert.equal(currentMainWindow.CellSize, cellSize);
    assert.notEqual(currentSweeper, prevSweeper);
};

exports['test new settings event starts new game'] = function() {
    setUp();
    
    game.start();

    var x = preferences.X + 1;
    var cellSize = preferences.CellSize + 10;
    preferences.setX(x);
    preferences.setCellSize(cellSize);
    var prevSweeper = currentSweeper;

    currentMainWindow.SettingsWindow.SettingsChangedEvent.fire();

    assert.notEqual(currentSweeper, prevSweeper);
    assert.equal(currentSweeper.X, x);
    assert.equal(currentMainWindow.CellSize, cellSize);
};

exports['test game finished event finish game with score if any'] = function() {
    setUp();
    
    game.start();

    currentSweeper.GameFinishedEvent.fire();

    assert.equal(currentMainWindow.EnterNameDialogShowed, true);
    assert.notEqual(currentMainWindow.Score, null);
    assert.equal(preferences.Scores[0].getName(), 'ohMyName');
};
	