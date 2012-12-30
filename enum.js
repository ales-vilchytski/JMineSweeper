//class Enum
function Enum(list) {
	//var en = new Object();
	for (var i in list) {
		this[list[i]] = { 
			str : list[i], 
			toString : function() { 
				return this.str; 
			} 
		};
	}
	//add Object.freeze(en) here
	//return en;
}