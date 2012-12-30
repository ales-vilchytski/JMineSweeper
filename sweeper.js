$.include('utils.js');
$.include('event.js');
$.include('state_manager.js');
$.include('enum.js');
$.include('cell.js');

//class Sweeper
function Sweeper(_x, _y, _mines) {	
	var x = (_x > 5) ? (_x) : (5);
	var y = (_y > 5) ? (_y) : (5);
	var mines = (_mines > 1) ? ( (_mines < x * y) ? (_mines) : (x * y - 1) ) 
							 : (1);
	
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getMines = function() { return mines; };
	
	var cells = new Array();
	this.getCells = function() { return cells; };

	//generate cells
	{
		var minesMap = new Array();
		for (var i = 0; i < x; ++i) {
			minesMap.push(new Array(y));
		}
		var minesCount = 0;
		
		while (minesCount < mines) {
			var xm = Math.floor(Math.random() * x);
			var	ym = Math.floor(Math.random() * y);
			if (minesMap[xm][ym] != true) {
				minesMap[xm][ym] = true;
				++minesCount;
			}
		}
		
		for (var i = 0; i < x; ++i) {
			cells.push(new Array());
			for (var j = 0; j < y; ++j) {
				var content;
				if (minesMap[i][j] === true) {
					content = Cell.Content.MINE;
				} else {
					content = Cell.Content.NONE;
				}
				cells[i].push(new Cell(false, content, Cell.Mark.NONE));
			}
		}
		//calculate mines around each cell
		var contentMap = new Array();
		contentMap[0] = Cell.Content.NONE;
		contentMap[1] = Cell.Content.ONE;
		contentMap[2] = Cell.Content.TWO;
		contentMap[3] = Cell.Content.THREE;
		contentMap[4] = Cell.Content.FOUR;
		contentMap[5] = Cell.Content.FIVE;
		contentMap[6] = Cell.Content.SIX;
		contentMap[7] = Cell.Content.SEVEN;
		contentMap[8] = Cell.Content.EIGHT;
			
		for (var i = 0; i < x; ++i) {
			for (var j = 0; j < y; ++j) {
				if (cells[i][j].content != Cell.Content.MINE) {
					var count = 0;
					visitNeighbourCells(cells, i, j, 
						function(cell, x, y) {
							if (cell.content === Cell.Content.MINE) { 
								++count;
							}
						});
					cells[i][j].content = contentMap[count];
				}
			}
		}			
	} 
	//end generate cells
	
	//Events
	{
		var eventKey = new Object();
		var minesRemainedChangedEvent = new Event(eventKey);
		this.getMinesRemainedChangedEvent = function() { return minesRemainedChangedEvent; };
		
		var secondsChangedEvent = new Event(eventKey);
		this.getSecondsChangedEvent = function() { return secondsChangedEvent; };
		
		var refreshCellEvent = new Event(eventKey);
		this.getRefreshCellEvent = function() { return refreshCellEvent; };
		
		var gameOverEvent = new Event(eventKey);
		this.getGameOverEvent = function() { return gameOverEvent; };
		
		var gameFinishedEvent = new Event(eventKey);
		this.getGameFinishedEvent = function() { return gameFinishedEvent; };
	}//end events
	
	var stateManager = new StateManager(Sweeper.State.BEGIN); //states see after class def
	this.getStateManager = function() { return stateManager; };
			
	var timer = null;
	var seconds = 0;
	this.getSeconds = function() { return seconds; };

	//initialize state manager with transitions
	{
		var finishGame = function() { 
			for (var i in cells) {
				for (var j in cells[i]) {
					refreshCellEvent.fire(eventKey, cells[i][j], i, j);		
				}
			}
			timer.cancel();
		};
		stateManager.addTransition(Sweeper.State.RUNNING, Sweeper.State.GAME_OVER, 
			function() {
				finishGame();
				gameOverEvent.fire(eventKey);
			});
		stateManager.addTransition(Sweeper.State.BEGIN, Sweeper.State.GAME_OVER, 
			function() {
				finishGame();
				gameOverEvent.fire(eventKey);
			});
		
		stateManager.addTransition(Sweeper.State.BEGIN, Sweeper.State.RUNNING, 
			function() {
				timer = java.util.Timer(true); //daemon
				timer.schedule(
					new Packages.by.ales.minesweeper.scripting.RunnableTimerTask(
						function() {
							secondsChangedEvent.fire(eventKey, ++seconds); 
						}), 1000, 1000);
			});
		stateManager.addTransition(Sweeper.State.RUNNING, Sweeper.State.FINISH, 
			function() {
				finishGame();
				minesRemained = 0;
				minesRemainedChangedEvent.fire(eventKey, minesRemained);
				gameFinishedEvent.fire(eventKey);
		});
	}
	//end initialize state manager
	
	var notClickedCells = x * y;
	
	var doClickCell = function(x, y) {
		cells[x][y].clicked = true;
		refreshCellEvent.fire(eventKey, cells[x][y], x, y);
		--notClickedCells;
	};
	
	//click and mark cell actions	
	var checkClickPreconditions = function(x, y) {
		if (stateManager.getCurrentState() === Sweeper.State.GAME_OVER ||
			stateManager.getCurrentState() === Sweeper.State.FINISH ||
			cells[x][y].clicked) {
			return false;
		} else {
			return true;
		}
	};
	
	
	var _clickCell = function(x, y) { 
		if (!checkClickPreconditions(x, y)) {
			return;
		}
		if (stateManager.getCurrentState() === Sweeper.State.BEGIN) {
			stateManager.changeState(Sweeper.State.RUNNING);
		}
		
		var mark = cells[x][y].mark;
		if (mark == Cell.Mark.FLAG) { 
			return; 
		}
	
		doClickCell(x, y);
			
		var content = cells[x][y].content;
		if (content === Cell.Content.MINE) {
			stateManager.changeState(Sweeper.State.GAME_OVER);
		} else if ((stateManager.getCurrentState() === Sweeper.State.RUNNING ||
				    stateManager.getCurrentState() === Sweeper.State.BEGIN) &&
				   notClickedCells == mines) {
			stateManager.changeState(Sweeper.State.FINISH);
		} else if (content === Cell.Content.NONE) {
			visitNeighbourCells(cells, x, y, 
				function(cell, m, n) {
					_clickCell(m, n);
				});
		}
	};
	this.clickCell = _clickCell;	//make _clickCell public
	
	var minesRemained = mines;
	this.minesRemained = function() { return minesRemained; };
	
	this.markCell = function(x, y) {
		if (!checkClickPreconditions(x, y)) {
			return;
		}
		
		var cell = cells[x][y];
		switch (cell.mark) {
			case Cell.Mark.NONE:
				cell.mark = Cell.Mark.FLAG;
				--minesRemained;
				minesRemainedChangedEvent.fire(eventKey, minesRemained);
				break;
			case Cell.Mark.FLAG:
				cell.mark = Cell.Mark.QUESTION;
				++minesRemained;
				minesRemainedChangedEvent.fire(eventKey, minesRemained);
				break;
			case Cell.Mark.QUESTION:
				cell.mark = Cell.Mark.NONE;
				break;
			default:
				throw "unknown mark " + cell.mark;
		}
		
		refreshCellEvent.fire(eventKey, cell, x, y);
	};

	this.dispose = function(x, y, mines) {
		if (timer) {
			timer.cancel();
		}
	};
	
	this.debug = function() {
		var cellsStr = '';
		for (var i in cells) {
			cellsStr += '\n';
			for (var j in cells[i]) {
				cellsStr += cells[i][j].content + '|';
			}
		}
	};
};

Sweeper.State = {
	BEGIN: '',
	RUNNING: '',
	GAME_OVER: '',
	FINISH: ''
}; 
Enum.apply(Sweeper.State);
