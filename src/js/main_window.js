$.include('event.js');
$.include('field.js');
$.include('settings_window.js');

//class MainWindow
function MainWindow() {
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			java.awt.BorderLayout,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.event,
		    java.awt.Dimension);
	
	var currentFrame = new swing.JFrame();
	currentFrame.setLocationByPlatform(true);
	currentFrame.setDefaultCloseOperation(swing.JFrame.EXIT_ON_CLOSE);
	var currentField = null;
	
	var settingsWindow = new SettingsWindow(currentFrame);
	this.getSettingsWindow = function() { return settingsWindow; };
	
	var key = new Object();
	var newGameEvent = new Event(key);
	this.getNewGameEvent = function() { return newGameEvent; };
	
	
	this.show = function(sweeper, cellSize) {
		var field = new Field(sweeper.getCells(), cellSize); //local short name
		if (currentField) {
			currentField.dispose();
			currentFrame.getContentPane().removeAll();
		}
		currentField = field;
		
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
			//menuBar.setSize(0, 20);
			menuBar.setLayout(new swing.FlowLayout(swing.FlowLayout.LEFT));
			currentFrame.setJMenuBar(menuBar);
				
			var fileMenu = new swing.JMenu('file');
			//fileMenu.setSize(20, 10);
			menuBar.add(fileMenu);
				
			var newGameItem = new swing.JMenuItem('New game');
			newGameItem.addActionListener(function(event) {
				newGameEvent.fire(key);
			});
			fileMenu.add(newGameItem);
				
			var settingsItem = new swing.JMenuItem('Settings');
			settingsItem.addActionListener(function(event) {
				settingsWindow.show();
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
		
		var x = sweeper.getCells()[0].length;
		var y = sweeper.getCells().length;
		var xSize = x * cellSize;
		var ySize = y * cellSize + menuBar.getHeight();
		currentFrame.setSize(xSize, ySize);
		
		var scroller = new swing.JScrollPane(field.getPanel());
		currentFrame.getContentPane().add(scroller);
		
		currentFrame.pack();
		currentFrame.setVisible(true);
	};
	
}