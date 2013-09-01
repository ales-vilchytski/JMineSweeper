function beanMock(obj) {
    function createAccessor(obj, name) {
        obj['set' + name] = function(val) { obj[name] = val; };
        obj['get' + name] = function() { return obj[name]; };
    }
    
    for (var i in obj) {
        if (obj[i] instanceof Function) continue;
        createAccessor(obj, i);
    }
    return obj;
}

function generateArray(x, y) {
    var arr = [];
    for (var i = 0; i < x; ++i) {
        arr.push([]);
        for (var j = 0; j < y; ++j) {
            arr[i].push({});
        }
    }
    return arr;
};

exports.beanMock = beanMock;
exports.generateArray = generateArray;