this.namespace = function(name, creator) {
	
	var parts = name.split('.');
	var ns = this;
	for (var i in parts) {
		if (ns[parts[i]]) {
			continue;
		} else {
			ns[parts[i]] = {};
			ns = ns[parts[i]];
		}
	}
	
	creator.apply(ns, null);
};
