//Class score
function Score(_name, _score) {
	
	var name = null;
	this.getName = function() { return name; };
	this.setName = function(__name) {
		name = String(pick(__name, 'Anonymous'));
	};
	
	var score = null;
	this.getScore = function() { return score; };
	this.setScore = function(__score) { 
		score = Number(pick(__score, 0));
	};
	
	this.setName(_name);
	this.setScore(_score);
	
	this.toString = function() {
		return this.getName() + ' ' + this.getScore();
	};
}
