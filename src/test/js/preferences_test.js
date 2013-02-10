$.include('preferences.js');


var PREF_KEY = 'by.ales.minesweeper.test.TestContext';
testCases(test,
	
	function storesAndGetsX() {
		var prefs = new Preferences(PREF_KEY);
		prefs.setX(10);
		var anotherPrefs = new Preferences(PREF_KEY);
		assert.that(anotherPrefs.getX(), eq(10));
		self.log('PASSED');
	}

);

