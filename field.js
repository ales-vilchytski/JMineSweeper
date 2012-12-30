$.include('utils.js');
$.include('event.js');

//class Field
function Field(cells) {
	
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.Color);
	
	var panel = null;
	this.getPanel = function() { return panel; };
	
	var eventKey = new Object();
	var clickCellEvent = new Event(eventKey);
	this.getClickCellEvent = function() { return clickCellEvent; };
	
	var markCellEvent = new Event(eventKey);
	this.getMarkCellEvent = function() { return markCellEvent; };
		
	var _cells = [];
	var createMouseClickListener = function(x, y) {
		return function(mouseEvent) {
			if (mouseEvent.getID() === mouseEvent.MOUSE_PRESSED) {
				if (swing.SwingUtilities.isLeftMouseButton(mouseEvent)) {
					clickCellEvent.fire(eventKey, x, y);
				} else if (swing.SwingUtilities.isRightMouseButton(mouseEvent)){
					markCellEvent.fire(eventKey, x, y);
				};
			}
		};
	};
	
	var grid = new swing.GridLayout(
			cells.length, cells[cells.length - 1].length, 4, 4);
	panel = new swing.JPanel(grid);
	for (var i in cells) {
		_cells.push([]);
		for (var j in cells[i]) {
			var button = new swing.JButton();
			button.setBackground(swing.Color.GRAY);
			panel.add(button);
			_cells[i].push(button);
			button.addMouseListener(createMouseClickListener(i, j));
		}
	}
	
	this.refreshCell = function(cell, x, y, state) {
		//reusable local functions
		{
			var markFlag = function() {
				_cells[x][y].setText('flag');
			};
			var showMine = function() {
				_cells[x][y].setText('mine');
			};
			var setClickedBackground = function() {
				_cells[x][y].setBackground(java.awt.Color.WHITE);
			};
		}
		//end reusable local functions
		
		if (!cell.clicked) {
			switch (cell.mark) {
				case Mark.FLAG: 
					if (state === State.GAME_OVER && 
						cell.content !== Content.MINE) {	//draw cross
						_cells[x][y].setText('X');
					} else {
						markFlag();
					}
					break;
				case Mark.QUESTION:
					if (state === State.GAME_OVER &&
						cell.content === Content.MINE){
						showMine();
						setClickedBackground();
					} else if (state === State.FINISH &&
							   cell.content === Content.MINE) {
						markFlag();
					} else {
						_cells[x][y].setText('?');
					}
					break;
				case Mark.NONE:
					if (state === State.GAME_OVER &&
							   cell.content === Content.MINE){
						showMine();
						setClickedBackground();
					} else if (state === State.FINISH &&
						cell.content === Content.MINE) {
						markFlag();
					} else {
						_cells[x][y].setText('');
					}
					break;
				default: 
					throw 'unknown mark ' + cell.mark;
			}
		} else {
			switch (cell.content) {
				case Content.MINE:
					showMine();
					//$('#'+rh).css('background-color', 'red');
					return;
				case Content.NONE:
					_cells[x][y].setText('');
					break;
				case Content.ONE:
					_cells[x][y].setText('1');
					//$('#'+rh).css('color', 'blue');
					break;
				case Content.TWO:
					_cells[x][y].setText('2');
					//$('#'+rh).css('color', 'green');
					break;
				case Content.THREE:
					_cells[x][y].setText('3');
					//$('#'+rh).css('color', 'red');
					break;
				case Content.FOUR:
					_cells[x][y].setText('4');
					//$('#'+rh).css('color', 'blue');
				break;
				case Content.FIVE:
					_cells[x][y].setText('5');
					//$('#'+rh).css('color', 'brown');
				break;
				case Content.SIX:
					_cells[x][y].setTextl('6');
					//$('#'+rh).css('color', 'turquoise');
				break;
				case Content.SEVEN:
					_cells[x][y].setText('7');
					//$('#'+rh).css('color', 'black');
				break;
				case Content.EIGHT:
					_cells[x][y].setText('8');
					//$('#'+rh).css('color', 'silver');
				break;
				default:
					_cells[x][y].setText(cell.content);
			}
			setClickedBackground();
		}
	};

}
