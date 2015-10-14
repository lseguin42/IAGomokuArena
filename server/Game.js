'use strict';

var DIR_TOP_LEFT        { x: -1,  y:  1 }
var DIR_TOP             { x:  0,  y:  1 }
var DIR_TOP_RIGHT       { x:  1,  y:  1 }
var DIR_RIGHT           { x:  1,  y:  0 }
var DIR_BOTTOM_RIGHT    { x:  1,  y: -1 }
var DIR_BOTTOM          { x:  0,  y: -1 }
var DIR_BOTTOM_LEFT     { x: -1,  y: -1 }
var DIR_LEFT            { x: -1,  y:  0 }

var games = {};

var directions = [
	DIR_TOP_LEFT,
	DIR_TOP,
	DIR_TOP_RIGHT,
	DIR_RIGHT,
	DIR_BOTTOM_RIGHT,
	DIR_BOTTOM,
	DIR_BOTTOM_LEFT,
	DIR_LEFT
];

function onBoard(x, y)
{
	if (x < 0 || x >= 19 || y < 0 || y >= 19)
		return false;
	return true;
}

function Game(id) {
	var self = this;
	
	self.id = id;
	self.board = board ;
	self.board = new Array(19);
	self.started = false;
	self.finished = false;
	self.players = [null, null];
	self.currentPlayerId = 0;
	self.actionsNeeded = [];
	for (var x = 0; x < 19; x++)
	{
  		self.board[x] = new Array(19);
		for (var y = 0; y < 19; y++)
			self.board[x][y] = null;
	}
}

Game.prototype.terminate = function () {
	self.finished = true;
	if (self.players[0])
		self.players[0].exit();
	if (self.players[1])
		self.players[1].exit();
	delete games[self.id];
	self.id = null;
}

Game.prototype.start = function() {
	var self = this;

	self.started = true;
	self.players[0].start();
}

Game.prototype.join = function(player) {
	var self = this;

	if (self.started || self.finished)
		return -2;
	if (self.player[0] && self.player[1])
		return -1;
	var idPlayer = 0;
	idPlayer = (self.player[0] ? 1 : 0);
	self.players[idPlayer] = player;
	player.on('leave', function () {
		if (self.players[idPlayer ^ 1])
			self.players[idPlayer ^ 1].otherLeave();
		self.terminate();
	});
	if (idPlayer == 1)
		self.start();
	return idPlayer;
}

Game.prototype.isRunning = function () {
	var self = this;

	return self.started && !self.finished;
}

Game.prototype.getCurrentPlayer = function() {
	var self = this;

	return self.players[self.currentPlayerId];
}

Game.prototype.rulesWin = function(x, y) {
	var self = this;

	var pawn = self.board[x][y];
	/*
    std::map<int, int> actions;
    int countPawn, countWin, totalWin = 0;
    t_direction direction, opposite;
    
    if (_ActionNeededOrLoose(action))
        return REV_PAWN(pawn);
    for (int i = 0; i < LEN(directions_opposite); i++) {
        countPawn = 0;
        direction = directions_opposite[i];
        opposite = OPPOSITE_DIR(direction);
        Action position(action);
        for (;
             position;
             countPawn++, position += direction)
            if ((*this)[position] != pawn)
                break ;
        for (position = action.slice(1, opposite);
             position;
             countPawn++, position += opposite)
            if ((*this)[position] != pawn)
                break ;
        position.walk(direction);
        if (countPawn < 5)
            continue ;
        countWin = countPawn - 4;
        for (int n = 0; n < countWin; n++, position += direction)
            getAllActionsCanCaptureSuiteWin(actions, position, direction);
        totalWin += countWin;
    }
    if (totalWin == 0)
        return -1;
    for (std::map<int, int>::iterator it = actions.begin(); it != actions.end(); ++it)
        if (it->second == totalWin)
            _nextActionNeeded.push_back(Action(it->first));
    if (_nextActionNeeded.empty())
        return pawn;
    return -1;
*/

// return Player
}

Game.prototype.rulesCapture = function(x, y) {
	var self = this;
// return int
}

Game.prototype.rulesAuthorized = function (x, y) {
	var self = this;
	
	var pawn = self.board[x][y];
	var find = 0;
	for (var i = 0; i < directions.lenght; i++) {
		var dir = directions[i];
		for (var x1 = x, y1 = y, i = 0; onBoard(x1, y1) && i < 5; x1 += dir.x, y1 += dir.y, i++)
		{
			var x2 = x1, y2 = y2;
			if (self.board[x2][y2] != null)
				continue ;
			x2 -= dir.x, y2 -= dir.y;
			var nbPawn = 0;
			var flagEmptyFound = false;
			for (var n = 0; onBoard(x2, y2) && n < 4; n++, x2 -= dir.x, y2 -= dir.y)
			{
				if (self.board[x2][y2] == pawn)
					nbPawn++;
				else if (self.board[x2][y2] == null && flagEmptyFound == false)
					flagEmptyFound == true;
				else
					break ;
				if (nbPawn == 3)
					break ;
			}
			if (nbPawn == 3)
			{
				x2 -= dir.x, y2 -= dir.y;
                if (self.board[x2][y2] == null)
                {
                    find++;
                    break ;
                }
			}
		}
		if (find == 2)
			return false;
	}
	return true;
}

Game.prototype.play = function (x, y) {
	var self = this;

	if (!self.isRunning())
		return -3;
	if (x < 0 || x >= 19 || y < 0 || y >= 19)
		return -1;
	if (self.board[x][y] != null)
		return -2;
	self.board[x][y] = self.currentPlayerId;
	if (self.rulesCapture(x, y) == 0)
	{
		if (self.rulesAuthorized(x, y) == false)
			return -4;
	}
	if ((self.winner = self.rulesWin(x, y)))
		self.terminate();
	self.currentPlayerId ^= 1;
	return 0;
}

Game.find = function (name) {
	if (typeof games[name] == 'undefined')
		games[name] = new Game(name);
	return games[name];
};

module.exports = Game;