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
					var button = new JButton(cells[i][j].content);
					panel.add(button);
					_cells[i].push(button);
					
					//add callbacks to provide commands to sweeper
				}
			}
		}
		//this.refreshMinesRemained(minesRemained);
		//this.refreshSeconds(seconds);
	};
	
	this.refreshCell = function(cell, x, y) {
		//reusable local functions
		{
			var markFlag = function() {
				$('#'+rh).html('<img src="img/flag.png"></img>');
			};
			var showMine = function() {
				$('#'+rh).html('<img src="img/mine.png"></img>');
			};
			var setClickedBackground = function() {
				$('#'+rh).attr('class', 'clickedCell');
			};
		}
		//end reusable local functions
		
		var rh = UI.XYToCellId(x, y);
		var state = this.getSweeper().getStateManager().getCurrentState();
		if (!cell.clicked) {
			var html = '';
			switch (cell.mark) {
				case Mark.FLAG: 
					if (state === State.GAME_OVER && 
						cell.content !== Content.MINE) {	//draw cross
						$('#'+rh).html('<img src="img/cross.png"></img>');
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
						$('#'+rh).html('<img src="img/question.png"></img>');
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
						$('#'+rh).html('');
					}
					break;
				default: 
					throw 'unknown mark ' + cell.mark;
			}
		} else {
			switch (cell.content) {
				case Content.MINE:
					showMine();
					$('#'+rh).css('background-color', 'red');
					return;
				case Content.NONE:
					$('#'+rh).html('');
					break;
				case Content.ONE:
					$('#'+rh).html('1');
					$('#'+rh).css('color', 'blue');
					break;
				case Content.TWO:
					$('#'+rh).html('2');
					$('#'+rh).css('color', 'green');
					break;
				case Content.THREE:
					$('#'+rh).html('3');
					$('#'+rh).css('color', 'red');
					break;
				case Content.FOUR:
					$('#'+rh).html('4');
					$('#'+rh).css('color', 'blue');
				break;
				case Content.FIVE:
					$('#'+rh).html('5');
					$('#'+rh).css('color', 'brown');
				break;
				case Content.SIX:
					$('#'+rh).html('6');
					$('#'+rh).css('color', 'turquoise');
				break;
				case Content.SEVEN:
					$('#'+rh).html('7');
					$('#'+rh).css('color', 'black');
				break;
				case Content.EIGHT:
					$('#'+rh).html('8');
					$('#'+rh).css('color', 'silver');
				break;
				default:
					$('#'+rh).html(cell.content);
			}
			setClickedBackground();
		}
	};
	
	this.refreshMinesRemained = function(minesRemained) {
		$('#mines').html(minesRemained);
	};
	
	this.refreshSeconds = function(seconds) {
		$('#seconds').html(seconds);
	};
	
	this.clear = function() {
		$('#field').html('');
		$('#mines').html('');
		$('#seconds').html('');
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
