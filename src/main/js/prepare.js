$.include('_init.js');

this.loadImage = function(path) {
	var stream = $.getClass().getResourceAsStream(path);
	return javax.imageio.ImageIO.read(stream);
};

this.pick = function(arg, def) {
	return ((typeof arg) == 'undefined' ? def : arg);
};

//Globals
$.include('preferences.js');

namespace('minesweeper.globals', function() {
	this.preferences = new Preferences('by.ales.minesweeper.Main');
});
