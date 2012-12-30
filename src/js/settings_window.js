$.include('settings.js');
$.include('utils.js');
$.include('event.js');

//class SettingsWindow
function SettingsWindow(parent, _settings /** initial settings */) {
	
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.event);
	
	var settings = _settings;
	this.getSettings = function() { return settings; };
	this.setSettings = function(_settings) { settings = _settings; };
	
	var eventKey = new Object();
	var settingsChangedEvent = new Event(eventKey);
	this.getSettingsChangedEvent = function() { return settingsChangedEvent; };
	
	var settingsWindow = null; //Swing implementation of window
	this.getWindow = function() { return settingsWindow; };
	
	this.show = function() {
		if (!settingsWindow) { //lazy init
			settingsWindow = new swing.JDialog(parent, 'Settings', true);
			settingsWindow.setSize(200, 300);
			settingsWindow.setLayout(new swing.GridLayout(4, 2));
				
			settingsWindow.add(new swing.JLabel('x'));
			var xField = new swing.JTextField(String(5));
			settingsWindow.add(xField);
	
			settingsWindow.add(new swing.JLabel('y'));
			var yField = new swing.JTextField(String(5));
			settingsWindow.add(yField);
				
			settingsWindow.add(new swing.JLabel('Mines'));
			var minesField = new swing.JTextField(String(5));
			settingsWindow.add(minesField);
				
			var okButton = new swing.JButton('Ok');
			var cancelButton = new swing.JButton('Cancel');
				
			okButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
				settings.x = Number(xField.getText());
				settings.y = Number(yField.getText());
				settings.mines = Number(minesField.getText());
				
				settingsChangedEvent.fire(eventKey, settings);
			});
			cancelButton.addActionListener(function(event) {
				settingsWindow.setVisible(false);
			});
			settingsWindow.add(okButton);
			settingsWindow.add(cancelButton);
		}
		
		settingsWindow.show();
		return settings;
	};
	
	this.hide = function() {
		settingsWindow.setVisible(false);
	};
}
