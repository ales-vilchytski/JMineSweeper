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

	function newGame() {
		var x = settings.x;
		var y = settings.y;
		var mines = settings.mines;
		
		if (currentSweeper) {
			currentSweeper.dispose();
		}
		currentSweeper = new Sweeper(x, y, mines);
		mainWindow.show(currentSweeper, 75);
	}
	
}