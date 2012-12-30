$.include('utils.js');
$.include('event.js');
$.include('cell.js');

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
				case Cell.Mark.FLAG: 
					if (state === Sweeper.State.GAME_OVER && 
						cell.content !== Cell.Content.MINE) {	//draw cross
						_cells[x][y].setText('X');
					} else {
						markFlag();
					}
					break;
				case Cell.Mark.QUESTION:
					if (state === Sweeper.State.GAME_OVER &&
						cell.content === Cell.Content.MINE){
						showMine();
						setClickedBackground();
					} else if (state === Sweeper.State.FINISH &&
							   cell.content === Cell.Content.MINE) {
						markFlag();
					} else {
						_cells[x][y].setText('?');
					}
					break;
				case Cell.Mark.NONE:
					if (state === Sweeper.State.GAME_OVER &&
							   cell.content === Cell.Content.MINE){
						showMine();
						setClickedBackground();
					} else if (state === Sweeper.State.FINISH &&
						cell.content === Cell.Content.MINE) {
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
				case Cell.Content.MINE:
					showMine();
					//$('#'+rh).css('background-color', 'red');
					return;
				case Cell.Content.NONE:
					_cells[x][y].setText('');
					break;
				case Cell.Content.ONE:
					_cells[x][y].setText('1');
					//$('#'+rh).css('color', 'blue');
					break;
				case Cell.Content.TWO:
					_cells[x][y].setText('2');
					//$('#'+rh).css('color', 'green');
					break;
				case Cell.Content.THREE:
					_cells[x][y].setText('3');
					//$('#'+rh).css('color', 'red');
					break;
				case Cell.Content.FOUR:
					_cells[x][y].setText('4');
					//$('#'+rh).css('color', 'blue');
				break;
				case Cell.Content.FIVE:
					_cells[x][y].setText('5');
					//$('#'+rh).css('color', 'brown');
				break;
				case Cell.Content.SIX:
					_cells[x][y].setTextl('6');
					//$('#'+rh).css('color', 'turquoise');
				break;
				case Cell.Content.SEVEN:
					_cells[x][y].setText('7');
					//$('#'+rh).css('color', 'black');
				break;
				case Cell.Content.EIGHT:
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
