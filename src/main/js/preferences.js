$.include('enum.js');
$.include('score.js');
$.include('lib/json2.js');

//class Preferences, wraps Java Preferences
function Preferences(key) {
	
	var prefs = java.util.prefs.Preferences.systemNodeForPackage(
			java.lang.Class.forName(key, true, $.getClass().getClassLoader()));
	
	var KEYS = Preferences.KEYS;
	
	this.getX = function() { 
		return Number(prefs.get(KEYS.X_SIZE, 5));
	};
	this.setX = function(x) {
		prefs.put(KEYS.X_SIZE, x);
	};
	
	this.getY = function() { 
		return Number(prefs.get(KEYS.Y_SIZE, 5));
	};
	this.setY = function(y) {
		prefs.put(KEYS.Y_SIZE, y);
	};
	
	this.getMines = function() { 
		return Number(prefs.get(KEYS.MINES, 5));
	};
	this.setMines = function(mines) {
		prefs.put(KEYS.MINES, mines);
	};
	
	var SCORES_SEP = Preferences.SCORES_SEP;
	var DEF_SCORES = Preferences.DEF_SCORES;
	
	this.getScores = function() { 
		//scores are saved as JSON
		try {
			var scores = [];
			var json = JSON.parse(String(prefs.get(KEYS.SCORES, '')));
			if (json instanceof Array) {
				for (var i = 0; i < json.length; ++i) {
					scores.push(new Score(json[i].name, json[i].score));
				}
				return scores;
			} else {
				return DEF_SCORES;
			}
		} catch (e) {
			return DEF_SCORES;
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
				return left.score < right.score;
			});
			forJson.slice(0, 5);
			
			var json = JSON.stringify(forJson);
			prefs.put(KEYS.SCORES, json);
		} else {
			throw "Scores can't be saved (" + scores + ")";
		}
	};
	
	this.getCellSize = function() { 
		return Number(prefs.get(KEYS.CELL_SIZE, 25));
	};
	this.setCellSize = function(cellSize) {
		prefs.put(KEYS.CELL_SIZE, cellSize);
	};
	
	this.getFontRatio = function() { 
		return Number(prefs.get(KEYS.FONT_RATIO, 0.5));
	};
	this.setFontRatio = function(fontRatio) {
		prefs.put(KEYS.FONT_RATIO, fontRatio);
	};
			
}

Preferences.KEYS = {
	X_SIZE : null,
	Y_SIZE : null,
	MINES : null,
	SCORES : null,
	CELL_SIZE : null,
	FONT_RATIO : null,
};
Enum.apply(Preferences.KEYS);
Preferences.SCORES_SEP = '|';
Preferences.DEF_SCORES = [ 
                          new Score('Master', 1000),
                          new Score('Beginner', 500), 
                          new Score('Rookie', 100) 
                          ];
