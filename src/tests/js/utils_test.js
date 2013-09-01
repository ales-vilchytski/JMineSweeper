var util = require('lib/util');
var generateArray = require('lib/test_util').generateArray;
var assert = require('assert');

exports['test pick'] = function() {
    assert.equal(util.pick('value', 1), 'value');
    assert.equal(util.pick({}['undef'], 1), 1);
    assert.equal(util.pick({ a: null}['a'], 1), null);
};

exports['test visitNeighbourCells'] = function() {
    var arr = generateArray(3, 3);

    for ( var i = 0; i < arr.length; ++i) {
        for ( var j = 0; j < arr[i].length; ++j) {
            util.visitNeighbourCells(arr, i, j, function(cell, i, j) {
                assert.equal(typeof i, 'number');
                assert.equal(typeof j, 'number');
                if (!cell.value) {
                    cell.value = 0;
                }
                ++(cell.value);
            });
        }
    }

    assert.equal(arr[0][0].value, 3);
    assert.equal(arr[0][1].value, 5);
    assert.equal(arr[0][2].value, 3);
    assert.equal(arr[1][0].value, 5);
    assert.equal(arr[1][1].value, 8);
    assert.equal(arr[1][2].value, 5);
    assert.equal(arr[2][0].value, 3);
    assert.equal(arr[2][1].value, 5);
    assert.equal(arr[2][2].value, 3);
};

exports['test copyArgsToArray'] = function() {
    var arr = util.copyArgsToArray(1, '2', [ 1 ]);
    assert.ok(arr instanceof Array);
    assert.equal(arr[0], 1);
    assert.equal(arr[1], '2');
    assert.deepEqual(arr[2], [ 1 ]);
};