$.include('sweeper.js');
$.include('field.js');
$.include('settings.js');
$.include('settings_window.js');

//class Game (acts as controller & builder)
function Game() {
	
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.event);
	
	this.start = function() {
		newGame();
	};
	
	var currentFrame = null;
	var currentSweeper = null;
	var settings = new Settings(5, 5, 5); //defaults

	function newGame() {
		var x = settings.x;
		var y = settings.y;
		var mines = settings.mines;
			
		if (!currentFrame) { //lazy init
			currentFrame = new swing.JFrame();
			currentFrame.setDefaultCloseOperation(swing.JFrame.EXIT_ON_CLOSE);
		}
		
		var prevSweeper = currentSweeper; //dispose later
		currentSweeper = new Sweeper(x, y, mines);
		setUpMainWindow(currentFrame, currentSweeper, 100);
		
		currentFrame.show();
		
		if (prevSweeper) {
			prevSweeper.dispose();
		}
	}
	
	var settingsWindow = null;

	function showSettingsWindow() {
		if (!settingsWindow) { //lazy init
			settingsWindow = new SettingsWindow(currentFrame, settings);
			settingsWindow.getSettingsChangedEvent().addListener(
				function(newSettings) {
					settings = newSettings;
					newGame();
				});
		}
		settingsWindow.show();
	}
	
	function setUpMainWindow(frame, sweeper, cellSize) {
		var field = new Field(sweeper.getCells());
		sweeper.getRefreshCellEvent().addListener(function(cell, x, y) {
			field.refreshCell(cell, x, y, 
					sweeper.getStateManager().getCurrentState());
		});
			
		field.getClickCellEvent().addListener(function(x, y) {
			sweeper.clickCell(x, y);
		});
			
		field.getMarkCellEvent().addListener(function(x, y) {
			sweeper.markCell(x, y);
		});
			
		//set menu
		{
			var menuBar = new swing.JMenuBar();
			menuBar.setLayout(new swing.FlowLayout(swing.FlowLayout.LEFT));
			frame.setJMenuBar(menuBar);
				
			var fileMenu = new swing.JMenu('file');
			fileMenu.setSize(20, 30);
			menuBar.add(fileMenu);
				
			var newGameItem = new swing.JMenuItem('New game');
			newGameItem.addActionListener(function(event) {
				newGame();
			});
			fileMenu.add(newGameItem);
				
			var settingsItem = new swing.JMenuItem('Settings');
			settingsItem.addActionListener(function(event) {
				showSettingsWindow();
			});
			fileMenu.add(settingsItem);
				
			var secMenu = new swing.JLabel('Seconds: ' + 0);
			menuBar.add(secMenu);
			sweeper.getSecondsChangedEvent().addListener(function(seconds) {
				secMenu.setText('Seconds: ' + seconds);
			});
			
			var minesMenu = new swing.JLabel('Mines: ' + sweeper.getMines());
			menuBar.add(minesMenu);
			sweeper.getMinesRemainedChangedEvent().addListener(
				function(minesRemained) {
					minesMenu.setText('Mines: ' + minesRemained);
				});
		}
		//end set menu
		
		sweeper.getGameFinishedEvent().addListener(function() {
			new swing.JDialog(currentFrame, 'score', false).show();
		});
		
		frame.setContentPane(field.getPanel());
		var x = sweeper.getCells().length;
		var y = sweeper.getCells()[0].length;
		frame.setSize(x * cellSize, y * cellSize);
	}
	
}
