var Enum = require('util').Enum;

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

Cell.Content = {
	NONE: '', 
	MINE: '',
	ONE: '',
	TWO: '', 
	THREE: '',
	FOUR: '', 
	FIVE: '', 
	SIX: '',
	SEVEN: '',
	EIGHT: ''
};
Enum.apply(Cell.Content);

Cell.Mark = {
	NONE: '', 
	FLAG: '', 
	QUESTION: ''
};
Enum.apply(Cell.Mark);


exports.Cell = Cell;