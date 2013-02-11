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
			MaxScores : 4,
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
	},
	
	function stores6ScoresDescending() {
		var scores = [new Score('a', 1), 
		              new Score('b', 2),
		              new Score('c', 3),
		              new Score('d', 4),
		              new Score('e', 5),
		              new Score('f', 6),
		              new Score('g', 7)];
		var preferences = new Preferences(PREF_KEY);
		preferences.setMaxScores(6);
		preferences.setScores(scores);
		
		var anotherPreferences = new Preferences(PREF_KEY);
		var anotherScores = anotherPreferences.getScores();
		assert.that(anotherScores.length, eq(preferences.getMaxScores()));
		
		for (var i = 0; i < anotherScores.length; ++i) {
			var shift = scores.length - i - 1;
			assert.that(anotherScores[i].toString(), eq(scores[shift].toString()));
		}
	}

);

