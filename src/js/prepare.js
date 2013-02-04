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
	
	if (creator) {
		creator.apply(ns, null);
	}
};

this.loadImage = function(path) {
	var stream = $.getClass().getResourceAsStream(path);
	return javax.imageio.ImageIO.read(stream);
};