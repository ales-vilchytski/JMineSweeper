var Score = require('score').Score;
var assert = require('assert');

exports['test setters and getters, and defaults'] = function() {
    // local reusable code
    function checkdef(score) {
        assert.equal(score.getName(), 'Anonymous');
        assert.equal(score.getScore(), 0);
    }

    // check defaults from constructor
    checkdef(new Score());

    // check defaults from setters
    var score = new Score();
    score.setName();
    score.setScore();
    checkdef(score);

    var name = "my";
    var sc = 2;
    score.setName(name);
    score.setScore(sc);
    assert.equal(score.getName(), name);
    assert.equal(score.getScore(), sc);
};