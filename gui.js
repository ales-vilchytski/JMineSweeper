$.include('sweeper.js')
$.include('field.js')

var SwingGui = new JavaImporter(
	java.awt.FlowLayout,
	java.awt.GridLayout,
	javax.swing,
    javax.swing.event,
    javax.swing.border,
    java.awt.event);

var settingsWindow;

//class Settings
function Settings(x, y, mines) {
	this.x = x;
	this.y = y;
	this.mines = mines;
	
	this.equals = function(other) {
		return  typeof(this) === typeof(other) &&
				this.x === other.x && 
				this.y === other.y &&
				this.mines === other.mines
	}
}
var settings = new Settings(5, 5, 5); //defaults

function showSettingsWindow() {
	if (!settingsWindow) {
		with (SwingGui) {
			settingsWindow = new JDialog(currentFrame, 'Settings', true);
			settingsWindow.setSize(200, 300);
			settingsWindow.setLayout(new GridLayout(4, 2));
			
			settingsWindow.add(new JLabel('x'));
			var xField = new JTextField(String(5));
			settingsWindow.add(xField);

			settingsWindow.add(new JLabel('y'));
			var yField = new JTextField(String(5));
			settingsWindow.add(yField);
			
			settingsWindow.add(new JLabel('Mines'));
			var minesField = new JTextField(String(5));
			settingsWindow.add(minesField);
			
			var okButton = new JButton('Ok');
			var cancelButton = new JButton('Cancel');
			
			okButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
				var s = new Settings(
						Number(xField.getText()),
						Number(yField.getText()),
						Number(minesField.getText()));
				if (!s.equals(settings)) {
					settings = s;
					newGame();
				}
			});
			cancelButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
			});
			settingsWindow.add(okButton);
			settingsWindow.add(cancelButton);
		}
	}
	settingsWindow.show();
}

function setMainWindow(frame, sweeper, cellSize) {
	with(SwingGui) {
		var field = new Field(sweeper.getCells());

		sweeper.addRefreshCellEventListener(function(cell, x, y) {
			field.refreshCell(cell, x, y, sweeper.getStateManager().getCurrentState());
		});
		
		field.addClickCellListener(function(x, y) {
			sweeper.clickCell(x, y);
		});
		
		field.addMarkCellEvent(function(x, y) {
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
			sweeper.addSecondsChangedEventListener(function(seconds) {
				secMenu.setText('Seconds: ' + seconds);
			});
			
			var minesMenu = new JLabel('Mines: ' + sweeper.getMines());
			menuBar.add(minesMenu);
			sweeper.addMinesRemainedChangedEventListener(function(minesRemained) {
				minesMenu.setText('Mines: ' + minesRemained);
			});
		}
		//end set menu
		
		sweeper.addGameFinishedEventListener(function() {
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
