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