//class Settings
function Settings(x, y, mines) {
	this.x = x;
	this.y = y;
	this.mines = mines;
	
	/** Not strict equals, anyway */
	this.equals = function(other) {	
		return  typeof(this) === typeof(other) &&
				this.x === other.x && 
				this.y === other.y &&
				this.mines === other.mines;
	};
}