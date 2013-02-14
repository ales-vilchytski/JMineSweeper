$.include('sweeper.js');
$.include('settings.js');
$.include('main_window.js');
$.include('preferences.js');

//class Game
function Game(preferences) {
	
	this.start = function() {
		newGame();
	};
	
	var currentSweeper = null;
	var mainWindow = new MainWindow();
	mainWindow.getNewGameEvent().addListener( function() {
		newGame();
	});
	mainWindow.getSettingsWindow().setSettings(preferences);
	mainWindow.getSettingsWindow().getSettingsChangedEvent().addListener(
		function(newSettings) {
			newGame();
		});
	
	function newGame() {
		var x = preferences.getX();
		var y = preferences.getY();
		var mines = preferences.getMines();
		
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
			
			var scores = preferences.getScores();
			var username = mainWindow.showEnterNameDialog(scores, score);
			scores.push(new Score(username, score));
			preferences.setScores(scores);
		});
		
		var cellSize = preferences.getCellSize();
		var fontSize = preferences.getFontSize();
		mainWindow.show(currentSweeper, cellSize, fontSize);
	}
	
}