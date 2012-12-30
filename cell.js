//class Cell
function Cell(clicked, content, mark) {
	this.clicked = clicked;
	this.content = content;
	this.mark = mark;
	
	this.toString = function() {
		return 	'Cell: { clicked: ' + this.clicked +
				'; content: ' + this.content + 
				'; mark: ' + this.mark + ' }';
	};
}