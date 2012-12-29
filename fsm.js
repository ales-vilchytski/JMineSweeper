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
	var stateChangedEvent = new EventManager(eventKey);
	this.getStateChangedEvent = function() { return stateChangedEvent; }
	
	this.changeState = function(newState) {
		var state = currentState;
		if (transitions[state] && transitions[state][newState]) {
			currentState = newState;
			transitions[state][newState].fire();
			stateChangedEvent.fire(eventKey, state, newState);
		} else {
			throw 'Transition from state ' + state + ' to state ' + newState + ' is undefined'
		}
	}
		
	this.toString = function() {
		var strs = []
		for (var i in transitions) {
			for (var j in transitions[i]) {
				if (transitions[i][j] instanceof EventManager) {
					strs.push(String(i) + ' => ' + String(j) + ':\n' 
						+ transitions[i][j].toString());
				}
			}
		}
		return strs.join('\n');
	}
}