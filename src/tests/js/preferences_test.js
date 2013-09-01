var Preferences = require('preferences').Preferences;
var Score = require('score').Score;
var util = require('lib/util');
var assert = require('assert');

function PreferencesStorage() {
    var storage = {};
    
    this.get = function(key, def) {
        return util.pick(storage[key], def);
    };
    
    this.put = function(key, value) {
        storage[key] = String(value);
    };
};

exports['test stores and gets simple types'] = function() {
    var storage = new PreferencesStorage();
    
    /*
     * For testing create object in form { FieldName : <value> } Note upper case
     * of first letter - it's needed to conform JavaBean conventions (this will
     * be used in form 'set' + 'FieldName' and 'get' + 'FieldName')
     */
    var testData = {
        X : 10,
        Y : 11,
        Mines : 12,
        MaxScores : 4,
        CellSize : 13,
        FontSize : 14
    };
    for ( var field in testData) {
        var preferences = new Preferences(storage);
        preferences['set' + field](testData[field]);

        var anotherPreferences = new Preferences(storage);
        assert.equal(anotherPreferences['get' + field](), testData[field]);
    }
};

exports['test stores and gets scores'] = function() {
    var storage = new PreferencesStorage();
    
    var preferences = new Preferences(storage);
    var name = 'myName';
    var score = 12;
    preferences.setScores([ new Score(name, score) ]);

    var anotherPreferences = new Preferences(storage);
    var scores = anotherPreferences.getScores();
    
    assert.equal(scores.length, 1);
    assert.equal(scores[0].getName(), name);
    assert.equal(scores[0].getScore(), score);
};

exports['test stores max scores descending'] = function() {
    var storage = new PreferencesStorage();
    var scores = [ 
            new Score('a', 1), new Score('b', 2), new Score('c', 3),
            new Score('d', 4), new Score('e', 5), new Score('f', 6),
            new Score('g', 7) ];
    var max_scores = 6;
    
    var preferences = new Preferences(storage);
    preferences.setMaxScores(max_scores);
    preferences.setScores(scores);

    var anotherPreferences = new Preferences(storage);
    var anotherScores = anotherPreferences.getScores();
    assert.equal(anotherScores.length, preferences.getMaxScores());

    for (var i = 0; i < anotherScores.length; ++i) {
        var shift = scores.length - (scores.length - max_scores) - i;
        assert.equal(anotherScores[i].toString(), scores[shift].toString());
    }
};
