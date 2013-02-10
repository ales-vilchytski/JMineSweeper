$.include('utils.js');
$.include('event.js');
$.include('cell.js');
$.include('sweeper.js');

//class Field
function Field(cells, cellSize) {
	
	var swing = new JavaImporter(
			java.awt.FlowLayout,
			java.awt.GridLayout,
			java.awt.Dimension,
			javax.swing,
		    javax.swing.event,
		    javax.swing.border,
		    java.awt.Color,
		    java.awt.Font);
	
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
	
	function icon(path) { //local icon creator
		return new swing.ImageIcon(loadImage(path).
			getScaledInstance(
				(cellSize) ? (cellSize - cellSize/5) : (30), //+ borders
				(cellSize) ? (cellSize - cellSize/5) : (30), 
				java.awt.Image.SCALE_SMOOTH));
	}
	var Icons = {
		MINE: icon('/resources/img/mine.png'),
		FLAG: icon('/resources/img/flag.png'),
		CROSS: icon('/resources/img/cross.png'),
		QUESTION: icon('/resources/img/question.png'),
	};
	
	var grid = new swing.GridLayout(
			cells.length, cells[cells.length - 1].length, 0, 0);
	panel = new swing.JPanel(grid);
	panel.setBorder(swing.BorderFactory.createLoweredBevelBorder());
	var font = new swing.Font(swing.Font.TYPE1_FONT, swing.Font.BOLD, cellSize / 2);
	for (var i in cells) {
		_cells.push([]);
		for (var j in cells[i]) {
			var button = new swing.JButton();
			button.setBorder(swing.BorderFactory.createRaisedBevelBorder());
			button.setBackground(swing.Color.LIGHT_GRAY);
			button.setFont(font);
			button.setPreferredSize(new swing.Dimension(cellSize, cellSize));
			panel.add(button);
			_cells[i].push(button);
			button.addMouseListener(createMouseClickListener(i, j));
		}
	}
	
	this.refreshCell = function(cell, x, y, state) {
		//reusable local functions
		{
			var markFlag = function() {
				_cells[x][y].setIcon(Icons.FLAG);
			};
			var showMine = function() {
				_cells[x][y].setIcon(Icons.MINE);
			};
			var setClickedBackground = function() {
				_cells[x][y].setIcon(null);
				_cells[x][y].setBackground(java.awt.Color.LIGHT_GRAY.brighter());
				_cells[x][y].setBorder(swing.BorderFactory.createEtchedBorder());
			};
		}
		//end reusable local functions
		
		if (!cell.clicked) {
			switch (cell.mark) {
				case Cell.Mark.FLAG: 
					if (state === Sweeper.State.GAME_OVER && 
							cell.content !== Cell.Content.MINE) {	//draw cross
						_cells[x][y].setIcon(Icons.CROSS);
					} else {
						markFlag();
					}
					break;
				case Cell.Mark.QUESTION:
					if (state === Sweeper.State.GAME_OVER &&
							cell.content === Cell.Content.MINE){
						showMine();
					} else if (state === Sweeper.State.FINISH &&
							   cell.content === Cell.Content.MINE) {
						markFlag();
					} else {
						_cells[x][y].setIcon(Icons.QUESTION);
					}
					break;
				case Cell.Mark.NONE:
					if (state === Sweeper.State.GAME_OVER &&
							cell.content === Cell.Content.MINE){
						showMine();
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
					_cells[x][y].setBackground(swing.Color.RED);
					return;
				case Cell.Content.NONE:
					_cells[x][y].setText('');
					break;
				case Cell.Content.ONE:
					_cells[x][y].setText('1');
					_cells[x][y].setForeground(swing.Color.BLUE);
					break;
				case Cell.Content.TWO:
					_cells[x][y].setText('2');
					_cells[x][y].setForeground(swing.Color.GREEN);
					break;
				case Cell.Content.THREE:
					_cells[x][y].setText('3');
					_cells[x][y].setForeground(swing.Color.RED);
					break;
				case Cell.Content.FOUR:
					_cells[x][y].setText('4');
					_cells[x][y].setForeground(swing.Color.BLUE);
				break;
				case Cell.Content.FIVE:
					_cells[x][y].setText('5');
					_cells[x][y].setForeground(swing.Color.ORANGE);
				break;
				case Cell.Content.SIX:
					_cells[x][y].setTextl('6');
					_cells[x][y].setForeground(swing.Color.CYAN);
				break;
				case Cell.Content.SEVEN:
					_cells[x][y].setText('7');
					_cells[x][y].setForeground(swing.Color.BLACK);
				break;
				case Cell.Content.EIGHT:
					_cells[x][y].setText('8');
					_cells[x][y].setForeground(swing.Color.LIGHT_GRAY);
				break;
				default:
					_cells[x][y].setText(cell.content);
			}
			setClickedBackground();
		}
	};

	this.dispose = function() {
		//TODO add disposing code
		panel.setVisible(false);
	};
}
