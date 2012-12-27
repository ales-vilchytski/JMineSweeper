$.include('sweeper.js')
$.include('field.js')
$.include('settings.js')
$.include('settings_window.js')

var SwingGui = new JavaImporter(
	java.awt.FlowLayout,
	java.awt.GridLayout,
	javax.swing,
    javax.swing.event,
    javax.swing.border,
    java.awt.event);

var settingsWindow;
var settings = new Settings(5, 5, 5); //defaults

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

function setMainWindow(frame, sweeper, cellSize) {
	with(SwingGui) {
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
			var menuBar = new JMenuBar();
			menuBar.setLayout(new FlowLayout(FlowLayout.LEFT));
			frame.setJMenuBar(menuBar);
			
			var fileMenu = new JMenu('file');
			fileMenu.setSize(20, 30);
			menuBar.add(fileMenu);
			
			var newGameItem = new JMenuItem('New game');
			newGameItem.addActionListener(function(event) {
				newGame();
			});
			fileMenu.add(newGameItem);
			
			var settingsItem = new JMenuItem('Settings');
			settingsItem.addActionListener(function(event) {
				showSettingsWindow();
			});
			fileMenu.add(settingsItem);
			
			var secMenu = new JLabel('Seconds: ' + 0);
			menuBar.add(secMenu);
			sweeper.getSecondsChangedEvent().addListener(function(seconds) {
				secMenu.setText('Seconds: ' + seconds);
			});
			
			var minesMenu = new JLabel('Mines: ' + sweeper.getMines());
			menuBar.add(minesMenu);
			sweeper.getMinesRemainedChangedEvent().addListener(
				function(minesRemained) {
					minesMenu.setText('Mines: ' + minesRemained);
				});
		}
		//end set menu
		
		sweeper.getGameFinishedEvent().addListener(function() {
			new JDialog(currentFrame, 'Score', false).show();
		});
		
		frame.setContentPane(field.getPanel());
		var x = sweeper.getCells().length;
		var y = sweeper.getCells()[0].length;
		frame.setSize(x * cellSize, y * cellSize);
	}
}

var currentFrame;
var currentSweeper;

function newGame() {
	var x = settings.x;
	var y = settings.y;
	var mines = settings.mines;
		
	var prevFrame = currentFrame; //dispose later
	var prevSweeper = currentSweeper;
	
	with (SwingGui) {
		currentFrame = new SwingGui.JFrame();
		currentFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		currentSweeper = new Sweeper(x, y, mines);
		
		setMainWindow(currentFrame, currentSweeper, 100);
		currentFrame.show();
	}
	if (prevFrame) {
		prevFrame.dispose();
	}
	if (prevSweeper) {
		prevSweeper.dispose();
	}
}

newGame(5,5,5);
