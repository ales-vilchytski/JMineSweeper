$.include('settings.js')
$.include('utils.js')

//class SettingsWindow
function SettingsWindow(parent, _settings /** initial settings */) {
	
	var settings = _settings;
	this.getSettings = function() { return settings; }
	this.setSettings = function(_settings) { settings = _settings; }
	
	var settingsChangedEvent = new EventManager();
	this.addSettingsChangedEventListener = function(listener) {
		settingsChangedEvent.addListener(listener);
	}
	
	var settingsWindow; //Swing implementation of window
	
	this.show = function() {
		if (!settingsWindow) { //lazy init
			with (SwingGui) {
				settingsWindow = new JDialog(parent, 'Settings', true);
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
						settingsChangedEvent.fire(settings);
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
		return settings;
	}
	
	this.hide = function() {
		settingsWindow.setVisible(false);
	}
}
