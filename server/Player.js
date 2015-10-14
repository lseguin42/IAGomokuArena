'use strict';

var EventEmitter = require('events').EventEmitter;
var Game = require('Game');

function Player(socket) {
	var self = this;

	self.socket = socket;
	self.__socketEventPlug();
}
Player.prototype = EventEmitter.prototype;

Player.prototype.__socketEventPlug = function () {
	var self = this;
	var socket = self.socket;

	socket.on('data', function (msg) {
		var patternJoin = new RegExp(/^join\s\+([a-zA-Z0-9]{4,20})$/);
		var patternPlay = new RegExp(/^play\s\+([0-9]\+)-([0-9]\+)$/);

		var argsJoin = msg.match(patternJoin);
		if (argsJoin)
			self.join(Game.find(argsJoin[1]));
		var argsPlay = msg.match(patternPlay);
		if (argsPlay)
			return self.play(argsPlay[1], argsPlay[2]);
	});
	socket.on('end', function () {
		self.emit('leave');
		socket.removeAllListeners();
		self.removeAllListeners();
	});

	self.on('error', function (error) {
		self.comment('[ERROR]: ' + error);
		socket.close();
	});
}

Player.prototype.send = function (msg) {
	var self = this;
	self.socket.write(msg + '\r\n');
}

Player.prototype.comment = function (comment) {
	var self = this;
	self.send('#' + comment);
}

Player.prototype.otherLeave = function () {
	self.comment('Partener leave game');
}

Player.prototype.pawnStr = function () {
	var self = this;

	return (self.pawn == 1 ? "WHITE" : "BLACK");
}

Player.prototype.join = function (game) {
	var self = this;

	if (self.game)
		return self.emit('error', 'already in game');
	if ((self.pawn = game.join(player)) < 0)
		return self.emit('error', 'cant join this game');
	self.game = game;
	self.send('setpawn ' + self.pawnStr());
}

Player.prototype.start = function () {
	var self = this;

	self.send('start');
}

Player.prototype.play = function(x, y) {
	var self = this;

	if (!self.game)
		return self.emit('error', 'not in game');
	if (!self.game.isRunning())
		return self.emit('error', 'game isnt started');
	if (self.game.getCurrentPlayer() != self)
		return self.emit('error', 'fuck you play after');
	if (self.game.play(x, y) < 0)
		return self.emit('error', 'you cant play here');
	self.game.getCurrentPlayer().send('play ' + x + '-' + y);
}