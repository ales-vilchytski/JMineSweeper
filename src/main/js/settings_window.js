var Event = require('event').Event;
var Settings = require('settings').Settings;

//class SettingsWindow
function SettingsWindow(parent) {
	
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.event);
	
	var preferences = null;
	this.getSettings = function() { return preferences; };
	this.setSettings = function(_settings) { preferences = _settings; };
	
	var eventKey = new Object();
	var settingsChangedEvent = new Event(eventKey);
	this.getSettingsChangedEvent = function() { return settingsChangedEvent; };
	
	var settingsWindow = null; //Lazy init-ed swing implementation of window
	this.getWindow = function() { return settingsWindow; };
	
	var xField = null, yField = null, minesField = null;
	
	// =============== User preferences ========================
	var cellSizeField = null, fontSizeField = null, maxScoresField = null;
	// =========================================================
	
	this.show = function() {
		if (!settingsWindow) { //lazy init
			settingsWindow = new swing.JDialog(parent, 'Settings', true);
			settingsWindow.setSize(200, 300);
			settingsWindow.setLayout(new swing.GridLayout(7, 2));
				
			settingsWindow.add(new swing.JLabel('x'));
			xField = new swing.JTextField();
			settingsWindow.add(xField);
	
			settingsWindow.add(new swing.JLabel('y'));
			yField = new swing.JTextField();
			settingsWindow.add(yField);
				
			settingsWindow.add(new swing.JLabel('Mines'));
			minesField = new swing.JTextField();
			settingsWindow.add(minesField);
			
			// =========== User preferences =================
			settingsWindow.add(new swing.JLabel('Cell size (px)'));
			cellSizeField = new swing.JTextField();
			settingsWindow.add(cellSizeField);
				
			settingsWindow.add(new swing.JLabel('Font size (px)'));
			fontSizeField = new swing.JTextField();
			settingsWindow.add(fontSizeField);
			
			settingsWindow.add(new swing.JLabel('Max scores'));
			maxScoresField = new swing.JTextField();
			settingsWindow.add(maxScoresField);
			// ================================================
			
			var okButton = new swing.JButton('Ok');
			var cancelButton = new swing.JButton('Cancel');
				
			okButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
				preferences.setX(Number(xField.getText()));
				preferences.setY(Number(yField.getText()));
				preferences.setMines(Number(minesField.getText()));
				
				// ============== User preferences =============
				preferences.setCellSize(Number(cellSizeField.getText()));
				preferences.setFontSize(Number(fontSizeField.getText()));
				preferences.setMaxScores(Number(maxScoresField.getText()));				
				// =============================================
				
				settingsChangedEvent.fire(eventKey, preferences);
			});
			cancelButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
			});
			settingsWindow.add(okButton);
			settingsWindow.add(cancelButton);
		}
		
		xField.setText(String(preferences.getX()));
		yField.setText(String(preferences.getY()));
		minesField.setText(String(preferences.getMines()));
		
		// ============= User preferences ===================
		cellSizeField.setText(String(preferences.getCellSize()));
		fontSizeField.setText(String(preferences.getFontSize()));
		maxScoresField.setText(String(preferences.getMaxScores()));
		// ==================================================
		
		settingsWindow.show();
	};
	
	this.hide = function() {
		settingsWindow.setVisible(false);
	};
}

exports.SettingsWindow = SettingsWindow;