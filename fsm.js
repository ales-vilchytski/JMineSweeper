$.include('event_manager.js')

//class FSM - finite state machine
function FSM(initialState) {
	var currentState = initialState;
	this.getCurrentState = function() { return currentState; }
	
	var transitions = new Object(); //hash-like storage
	
	this.addTransition = function(fromState, toState, func) {
		if (!transitions[fromState]) { 
			transitions[fromState] = new Object(); 
		}
		if (!transitions[fromState][toState]) {
			transitions[fromState][toState] = new EventManager();
		}		
		transitions[fromState][toState].addListener(func);
	}
	
	var eventKey = new Object();
	var changeStateEvent = new EventManager(eventKey);
	this.getChangeStateEvent = function() { return changeStateEvent; }
	
	this.changeState = function(newState) {
		var state = currentState;
		currentState = newState;
		transitions[state][newState].fire();
		
	}
	
	this.toString = function() {
		var strs = []
		for (var i in transitions) {
			for (var j in transitions[i]) {
				alert(transitions[i][j]);
			}
		}
	}
}