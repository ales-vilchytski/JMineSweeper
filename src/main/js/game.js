$.include('sweeper.js');
$.include('settings.js');
$.include('main_window.js');

//class Game
function Game() {
	
	this.start = function() {
		newGame();
	};
	
	var currentSweeper = null;
	var settings = new Settings(5, 5, 5); //defaults
	var mainWindow = new MainWindow();
	mainWindow.getNewGameEvent().addListener( function() {
		newGame();
	});
	mainWindow.getSettingsWindow().setSettings(settings);
	mainWindow.getSettingsWindow().getSettingsChangedEvent().addListener(
		function(newSettings) {
			newGame();
		});

	function cutSettings(settings) {
		var maxX = 10;
		var maxY = 10;
		var minX = 2;
		var minY = 2;
		var x = settings.x, y = settings.y, m = settings.mines;
		x = (x < maxX) ? ( (x < minX) ? (minX) : (x) ) 
					   : (maxX);
		y = (y < maxY) ? ( (y < minY) ? (minY) : (y) ) 
					   : (maxY);
		m = (m > 1) ? ( (m < x * y) ? (m) : (x * y - 1) ) 
					: (1);
		settings.x = x;
		settings.y = y;
		settings.mines = m;
	};
	
	function newGame() {
		cutSettings(settings);
		var x = settings.x;
		var y = settings.y;
		var mines = settings.mines;
		
		if (currentSweeper) {
			currentSweeper.dispose();
		}
		currentSweeper = new Sweeper(x, y, mines);
		
		currentSweeper.getGameFinishedEvent().addListener(function() {
			var x = currentSweeper.getX(), 
				y = currentSweeper.getY(),
				seconds = currentSweeper.getSeconds(),
				mines = currentSweeper.getMines();
			
			//score calculation algorithm
			var score = Math.floor(
					80000 * mines * mines / (x * y) / (seconds + 50));
			// ====
			
			mainWindow.showScore(score);
		});
		mainWindow.show(currentSweeper, 75);
	}
	
}