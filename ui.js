$.include('sweeper.js')

var SwingGui = new JavaImporter(
	java.awt.FlowLayout,
	javax.swing,
    javax.swing.event,
    javax.swing.border,
    java.awt.event);

//class UI
function UI() {
	
	var sweeper;
	this.setSweeper = function(_sweeper) { sweeper = _sweeper; };
	this.getSweeper = function() { return sweeper; };
	
	var panel;
	this.getPanel = function() { return panel; };	
	var _cells = [];
	this.show = function(cells, minesRemained, seconds) {
		with (SwingGui) {
			panel = new JPanel(new GridLayout(cells.length, cells[cells.length - 1].length));
			for (var i in cells) {
				_cells.push([]);
				for (var j in cells[i]) {
					var button = new JButton();
					panel.add(button);
					_cells[i].push(button);
					
					var listener = function(_i, _j) {
						return function(mouseEvent) {
							if (SwingUtilities.isRightMouseButton(mouseEvent)) {
								sweeper.markCell(_i, _j);
							} else if (SwingUtilities.isLeftMouseButton(mouseEvent)) {
								sweeper.clickCell(_i, _j);
							}
						};
					}
					button.addMouseListener(listener(i, j));
				}
			}
		}
		this.refreshMinesRemained(minesRemained);
		this.refreshSeconds(seconds);
	};
	
	this.refreshCell = function(cell, x, y) {
		//reusable local functions
		{
			var markFlag = function() {
				_cells[x][y].setText('flag');
			};
			var showMine = function() {
				_cells[x][y].setText('mine');
			};
			var setClickedBackground = function() {
				//_cells[x][y].setText('_');
			};
		}
		//end reusable local functions
		
		var state = this.getSweeper().getStateManager().getCurrentState();
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
	
	this.refreshMinesRemained = function(minesRemained) {
		//$('#mines').html(minesRemained);
	};
	
	this.refreshSeconds = function(_seconds) {
		//$('#seconds').html(seconds);
	};
	
	this.clear = function() {
		//$('#field').html('');
		//$('#mines').html('');
		//$('#seconds').html('');
	};
}

UI.XYToCellId = function(x, y) {
	return 'r' + x + 'h' + y;
}
	
UI.cellIdToXY = function(rh) {
	return { 
		x : Number(rh.match(/^r(\d+)/)[1]), 
		y : Number(rh.match(/h(\d+)$/)[1])
	};			
}

//class Score
function Score(name, score) {
	this.name = name;
	this.score = score;
}
