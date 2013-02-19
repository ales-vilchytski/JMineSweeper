$.include('game.js');
$.include('event.js');

var currentMainWindow = null; //static var with last created mainWindow

//mocks
this.MainWindow = function() {
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

this.Sweeper = function(x, y, mines) {
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

var preferences = null;
var game = null;

testCases(test,
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
	 	
	 	game = new Game(preferences);
	},
	
	function checkCreationOfSweeperAndMainWindow() {
		game.start();
		
		assert.that(currentSweeper, not(eq(null)));
		assert.that(currentMainWindow, not(eq(null)));
		
		assert.that(currentSweeper.X, eq(preferences.X));
		assert.that(currentSweeper.Y, eq(preferences.Y));
		assert.that(currentSweeper.Mines, eq(preferences.Mines));
		assert.that(currentSweeper.Seconds, eq(5));
		
		assert.that(currentMainWindow.CellSize, eq(preferences.CellSize));
		assert.that(currentMainWindow.FontSize, eq(preferences.FontSize));
		assert.that(currentMainWindow.Sweeper, eq(currentSweeper));
	},
	
	function checkMainWindowShowOnStart() {
		game.start();
		
		assert.that(currentMainWindow.Showed, eq(true));
	},
	
	function checkDisposingSweeper() {
		game.start();
		var prevSweeper = currentSweeper;
		game.start();
		
		assert.that(prevSweeper.Disposed, eq(true));
		assert.that(currentSweeper.Disposed, eq(false));
	},
	
	function checkNewGameEventHandling() {
		currentMainWindow.NewGameEvent.fire();
		
		//to check if new game created change preferences and check new values
		var x = preferences.X + 1;
		var cellSize = preferences.CellSize + 10;
		preferences.setX(x);
		preferences.setCellSize(cellSize);
		
		currentMainWindow.NewGameEvent.fire();
				
		assert.that(currentSweeper.X, eq(x));
		assert.that(currentMainWindow.CellSize, eq(cellSize));
	},
	
	function checkNewSettingsEventHandling() {
		game.start();
		
		var x = preferences.X + 1;
		var cellSize = preferences.CellSize + 10;
		preferences.setX(x);
		preferences.setCellSize(cellSize);
		
		currentMainWindow.SettingsWindow.SettingsChangedEvent.fire();

		assert.that(currentSweeper.X, eq(x));
		assert.that(currentMainWindow.CellSize, eq(cellSize));
	},
	
	function checkGameFinishedEventHandling() {
		game.start();
		
		currentSweeper.GameFinishedEvent.fire();
		
		assert.that(currentMainWindow.EnterNameDialogShowed, eq(true));
		assert.that(currentMainWindow.Score, not(eq(null)));
		assert.that(preferences.Scores[0].getName(), eq('ohMyName'));
	}
);