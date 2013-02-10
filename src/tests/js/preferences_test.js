$.include('preferences.js');

var PREF_KEY = 'by.ales.minesweeper.test.TestContext';

testCases(test,

	function storesAndGetsSimpleTypes() {	
		/*
		 * For testing create object in form { FieldName : <value> } Note upper case
		 * of first letter - it's needed to conform JavaBean conventions (this will
		 * be used in form 'set' + 'FieldName' and 'get' + 'FieldName')
		 */
		var testData = {
			X : 10,
			Y : 11,
			Mines : 12,
			CellSize : 13,
			FontRatio : 14
		};
		for ( var field in testData) {
			var preferences = new Preferences(PREF_KEY);
			preferences['set' + field](testData[field]);
	
			var anotherPreferences = new Preferences(PREF_KEY);
			assert.that(anotherPreferences['get' + field](), eq(testData[field]));
		}
	},
	
	function storesAndGetsScores() {
		var preferences = new Preferences(PREF_KEY);
		var name = 'myName';
		var score = 12;
		preferences.setScores([new Score(name, score)]);
		
		var anotherPreferences = new Preferences(PREF_KEY);
		var scores = anotherPreferences.getScores();
		assert.that(scores.length, eq(1));
		assert.that(scores[0].getName(), eq(name));
		assert.that(scores[0].getScore(), eq(score));
	}

);

