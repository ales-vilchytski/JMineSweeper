$.include('enum.js');
$.include('score.js');

//class Preferences, wraps Java Preferences
function Preferences(key) {
	
	var prefs = java.util.prefs.Preferences.systemNodeForPackage(
			java.lang.Class.forName(key, true, $.getClass().getClassLoader()));
	var KEYS = {
		X_SIZE : null,
		Y_SIZE : null,
		MINES : null,
		SCORES : null,
		CELL_SIZE : null,
		FONT_RATIO : null,
	};
	Enum.apply(KEYS);
	
	this.getX = function() { 
		return Number(prefs.get(KEYS.X_SIZE, 5));
	};
	this.setX = function(x) {
		prefs.put(KEYS.X_SIZE, pick(x, 5));
	};
	
	this.getY = function() { 
		return prefs.get(KEYS.Y_SIZE, 5);
	};
	this.setY = function(y) {
		prefs.put(KEYS.Y_SIZE, y || 5);
	};
	
	this.getMines = function() { 
		return prefs.get(KEYS.MINES, 5);
	};
	this.setMines = function(mines) {
		prefs.put(KEYS.MINES, mines || 5);
	};
	
	var SCORES_SEP = '|';
	var DEF_SCORES = [
	                 new Score('Master', 1000), 
	                 new Score('Beginner', 500), 
	                 new Score('Rookie', 100)
	                 ];
	this.getScores = function() { 
		//scores are saved as string
		var str = prefs.get(KEYS.SCORES, 5);
		var scoresArr = str.split(SCORES_SEP);
		var scores = [];
		for (var i = 0; i < scoresArr.length; ++i) {
			scores.push(Score.fromString(scoresArr[i]));
		}
		return scores;
	};
	this.setScores = function(scores) {
		if (scores) {
			scores.sort(function(left, right) {
				return left.getScore() < right.getScore();
			});
			scores.splice(0, 5);
			for (var i = 0; i < scores.length; ++i) {
				scores[i].replace(SCORES_SEP, '!');
			}
		}
		prefs.put(KEYS.SCORES, scores.join(SCORES_SEP) || DEF_SCORES);
	};
	
	this.getCellSize = function() { 
		return prefs.get(KEYS.CELL_SIZE, 25);
	};
	this.setCellSize = function(cellSize) {
		prefs.put(KEYS.CELL_SIZE, cellSize || 25);
	};
	
	this.getfontRatio = function() { 
		return prefs.get(KEYS.FONT_RATIO, 0.5);
	};
	this.setfontRatio = function(fontRatio) {
		prefs.put(KEYS.FONT_RATIO, fontRatio || 0.5);
	};
			
}
