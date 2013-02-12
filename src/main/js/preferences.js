$.include('enum.js');
$.include('score.js');
$.include('lib/json2.js');
$.include('util/fields.js');

//class Preferences, wraps Java Preferences
function Preferences(key) {
	
	/**
	 * Because the most of time we need simple fields to save\load let's use next approach:
	 * - create simple holder with validation logic;
	 * - OR create simple holder without validation logic;
	 * - store this holder with according name in hash (oh, in object, sorry);
	 * - generate accessors for every holder, accessors delegate validation and 
	 * 	 default values resolution to holder and use preferences to save\load values;
	 * Drawback is that autocomplete doesn't recognize these fields.
	 * In complicated cases custom accessors should be created. 
	 */
	
	var prefs = java.util.prefs.Preferences.systemNodeForPackage(
			java.lang.Class.forName(key, true, $.getClass().getClassLoader()));
	
	var FIELDS = {	//maps field name to key in preferences
		X_SIZE : new util.NumHolder('X', 5, 2, 20),
		Y_SIZE : new util.NumHolder('Y', 5, 2, 20),
		MINES : new util.NumHolder('Mines', 5, 1, 399),
		CELL_SIZE : new util.NumHolder('CellSize', 50, 10, 120),
		FONT_SIZE : new util.NumHolder('FontSize', 30, 5, 120),
		MAX_SCORES : new util.NumHolder('MaxScores', 5, 1, 20),		
		SCORES : new util.Holder('Scores', //add accessors later by hand
					[new Score('Master', 1000), 
				     new Score('Beginner', 500),
				     new Score('Rookie', 100)]),
	};

	function generateGetter(key, field) { 
		return function() { 
			//at first set value to field, it will be checked there
			field.setValue(
				prefs.get(key, field.getDefaultValue()));
			return field.getValue(); 
		}; 
	};
	function generateSetter(key, field) { 
		return function(val) { 
			field.setValue(val);
			prefs.put(key, field.getValue());
		};
	};

	//generate accessors
	for (var key in FIELDS) {
		var field = FIELDS[key];
		var name = field.getName();
		this['get' + name] = generateGetter(key, field);
		this['set' + name] = generateSetter(key, field);
	}
	
	//add logic for save/load scores via JSON
	//not so pretty solution but still
	this.getScores = function() { 
		// scores are saved as JSON
		try {
			var scores = [];
			var json = JSON.parse(String(prefs.get('SCORES', '')));
			if (json instanceof Array) {
				for (var i = 0; i < json.length; ++i) {
					scores.push(new Score(json[i].name, json[i].score));
				}
				return scores;
			} else {
				return FIELDS.SCORES.getDefaultValue();
			}
		} catch (e) {
			return FIELDS.SCORES.getDefaultValue();;
		}
	};
	this.setScores = function(scores) {
		if (scores && scores.length > 0) {
			var forJson = [];
			for (var i = 0; i < scores.length; ++i) {
				if(scores[i] instanceof Score) {
					forJson.push({ 
						name: scores[i].getName(), 
						score : scores[i].getScore() 
					});
				}
			}
			forJson.sort(function(left, right) {
				return left.score < right.score; //descending
			});
			forJson = forJson.slice(0, this.getMaxScores());
			
			var json = JSON.stringify(forJson);
			prefs.put('SCORES', json);
		} else {
			throw "Scores can't be saved (" + scores + ")";
		}
	};
	
}
