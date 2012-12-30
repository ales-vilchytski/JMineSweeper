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
}