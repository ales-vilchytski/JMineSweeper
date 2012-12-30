$.include('cell.js'); 

function fun() {
	this.qwe = 'qwe';
};

fun.En = {
		FIRST: {},
		SECOND: {}
	};
Enum.apply(fun.En);


$.debug();