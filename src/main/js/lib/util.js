function pick(arg, def) {
	return ((typeof arg) == 'undefined' ? def : arg);
};

function visitNeighbourCells(cellsArray, xx, yy, callback) {
	var x = Number(xx), y = Number(yy);
	for (var i = x - 2; ++i <= x + 1; ) {
		for (var j = y - 2; ++j <= y + 1; ) {
			if (i >= 0 && i < cellsArray.length &&
				(j >= 0 && j < cellsArray[i].length) &&
				!(i === x && j === y)) {
				callback(cellsArray[i][j], i, j);
			}
		}
	}
}

function copyArgsToArray() {
	var args = [];
	for (var i = 0; i < arguments.length; ++i) {
		args.push(arguments[i]);
	}
	return args;
}

//class Enum
function Enum(list) {
	if (!list) {
		list = this;
	}
	if (!(list instanceof Array)) { //object?
		var props = [];
		for (var i in list) {
			props.push(i);
		}
		list = props;
	}
	for (var i in list) {
		this[list[i]] = { 
			str : list[i], 
			toString : function() { 
				return this.str; 
			}
		};
	}
	
	this.toString = function() {
		var str = [];
		for (var i in this) {
			str.push(i);
		}
		return str.join(',');
	};
	//add Object.freeze(this) here
};

//class Event
function Event(_activatorKey) {

	var activatorKey = _activatorKey;
	this.getActivatorKey = function() { return activatorKey; };
	
	var listeners = [];
	
	this.addListener = function(listener) {
		listeners.push(listener);
	};
	
	this.removeListener = function(listener) {
		var i = listeners.length;
		while (--i >= 0) {
			if (listeners[i] === listener) {
				listeners.splice(i, 1);
			}
		}
	};
	
	/** Fires event with specified arguments, passed to all listeners.
	 *  If activation key was setted due constructing instance, this key 
	 *  is compared to object passed as first argument (_activatorKey).
	 *  
	 *  @param {Object} _activatorKey - <i>Optional</i>, 
	 *  	key to fire event (compared by strong equality '===')
	 *  @param {any} args - all arguments except <b>_activatorKey</b> 
	 *  	(if present in constructor), that should be passed to listeners
	 *  @return void
	 */
	this.fire = function(_activatorKey) {
		var args = arguments;
		if (activatorKey != null) {
			if (activatorKey === _activatorKey) {
				args = copyArgsToArray.apply(null, arguments).slice(1);
			} else {
				throw 'Wrong event activation key'; // "debug"-exception
			}
		}
		for (var i in listeners) {
			var listener = listeners[i];
			listener.apply(null, args);
		}
	};
	
	this.toString = function() {
		var strs = [];
		for (var i in listeners) {
			strs.push(listeners[i]);
		}
		return strs.join('\n');
	};
};

exports.pick = pick;
exports.visitNeighbourCells = visitNeighbourCells;
exports.copyArgsToArray = copyArgsToArray;
exports.Enum = Enum;
exports.Event = Event;