$.include('utils.js')

//class EventManager
function EventManager(_activatorKey) {

	var activatorKey = _activatorKey;
	this.getActivatorKey = function() { return activatorKey; }
	
	var listeners = [];
	
	this.addListener = function(listener) {
		listeners.push(listener);
	}
	
	this.removeListener = function(listener) {
		var i = listeners.length;
		while (--i >= 0) {
			if (listeners[i] === listener) {
				listeners.splice(i, 1);
			}
		}
	}
	
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
				throw 'Wrong event activation key';
			}	
		}
		for (var i in listeners) {
			var listener = listeners[i];
			listener.apply(null, args);
		}
	}	
}