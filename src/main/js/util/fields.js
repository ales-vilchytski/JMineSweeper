namespace('util', function() {
	
	/**
	 * class Holder - simple holder
	 */
	this.Holder = function(name, def_val) {
		var def_value = def_val;
		var value = def_val;
		
		this.getDefaultValue = function() { return def_value; };
		
		this.getValue = function() { return value; };
		this.setValue = function(val) { value = val; };
		
		this.getName = function() { return name; };
	};
	
	/**
	 * Class to store numeric Holder with restrictions
	 * @extends Holder
	 */
	this.NumHolder = function(name, default_value, min, max) {
		this.constructor.prototype.constructor.call(this, name, Number(default_value));
		
		var value = Number(default_value);
		
		/** @override */
		this.getValue = function() { return value; };
		
		/** @override */
		this.setValue = function(val) { 
			if ((typeof val) == 'undefined') {
				throw 'Value is not defined';
			} else if (val == null) {
				value = Number(default_value);
			} else if (val < min || val > max) {
				throw 'Value ' + val + ' not in range ' + min + '..' + max;
			} else {
				value = Number(val);
			}
		};
	};
	this.NumHolder.prototype = new this.Holder();
	
});