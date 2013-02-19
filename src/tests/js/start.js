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

var dir = attributes.get('testRunnerDir');

$.include('prepare.js');
$.include('rhinounit_1_2_1/rhinoUnitUtil.js');
$.execute('rhinounit_1_2_1/rhinoUnitAnt.js');
