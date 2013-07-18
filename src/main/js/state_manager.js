var State = require('lib/util').State;

//class StateManager - essential part of finite state machine
function StateManager(initialState) {
	var currentState = initialState;
	this.getCurrentState = function() { return currentState; };
	
	var transitions = new Object(); //hash-like storage
	
	this.addTransition = function(fromState, toState, func) {
		if (!transitions[fromState]) { 
			transitions[fromState] = new Object(); 
		}
		if (!transitions[fromState][toState]) {
			transitions[fromState][toState] = new Event();
		}		
		transitions[fromState][toState].addListener(func);
	};
	
	var eventKey = new Object();
	var stateChangedEvent = new Event(eventKey);
	this.getStateChangedEvent = function() { return stateChangedEvent; };
	
	this.changeState = function(newState) {
		var state = currentState;
		if (transitions[state] && transitions[state][newState]) {
			currentState = newState;
			transitions[state][newState].fire();
			stateChangedEvent.fire(eventKey, state, newState);
		} else {
			throw 'Transition from state ' + state + ' to state ' + newState + ' is undefined';
		}
	};
		
	this.toString = function() {
		var strs = [];
		for (var i in transitions) {
			for (var j in transitions[i]) {
				if (transitions[i][j] instanceof Event) {
					strs.push(String(i) + ' => ' + String(j) + ':\n' 
						+ transitions[i][j].toString());
				}
			}
		}
		return strs.join('\n');
	};
}

exports.StateManager = StateManager;