$.include('utils.js');

testCases(test,
	
	function visitField() {
		var arr = generateArray(3, 3);
		
		for (var i = 0; i < arr.length; ++i) {
			for (var j = 0; j < arr[i].length; ++j) {
				visitNeighbourCells(arr, i, j, function(cell, i, j) {
					assert.that(typeof i, not(eq('undefined')));
					assert.that(typeof j, not(eq('undefined')));
					if (!cell.value) { cell.value = 0; }
					++(cell.value);
				});
			}
		}
		
		assert.that(arr[0][0].value, eq(3));
		assert.that(arr[0][1].value, eq(5));
		assert.that(arr[0][2].value, eq(3));
		assert.that(arr[1][0].value, eq(5));
		assert.that(arr[1][1].value, eq(8));
		assert.that(arr[1][2].value, eq(5));
		assert.that(arr[2][0].value, eq(3));
		assert.that(arr[2][1].value, eq(5));
		assert.that(arr[2][2].value, eq(3));
	},

	function copyArgs() {
		var arr = copyArgsToArray(1, '2', [1]);
		assert.that(arr, isA(Array));
		assert.that(arr[0], eq(1));
		assert.that(arr[1], eq('2'));
		assert.that(arr[2], isA(Array));
		assert.that(arr[2][0], eq(1));
	}
	
);