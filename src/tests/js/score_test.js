$.include('score.js');

testCases(test, 
			
	function checkSettersAndGettersAndDefaults() {
		//local reusable code
		function checkdef(score) {
			assert.that(score.getName(), eq('Anonymous'));
			assert.that(score.getScore(), eq(0));
		}
		
		//check defaults from constructor
		checkdef(new Score());	
		
		//check defaults from setters
		var score = new Score();
		score.setName();
		score.setScore();
		checkdef(score);
		
		var name = "my";
		var sc = 2;
		score.setName(name);
		score.setScore(sc);
		assert.that(score.getName(), eq(name));
		assert.that(score.getScore(), eq(sc));
	}
);