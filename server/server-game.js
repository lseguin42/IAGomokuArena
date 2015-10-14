'use strict';

var net = require('net');
var EventEmitter = require('events').EventEmitter;
var Game = require('Game');
var Player = require('player');

var Games = {};

server.listen(4242);

function findGame(name) {
	if (typeof Games[name] == 'undefined')
		Games[name] = new Game();
	return Games[name];
}

function GameServer() {
	var self = this;

	self.server = net.createServer(function (socket) {
		console.log('New gamer connect');
		var player = new Player(socket);
	});
}
GameServer.prototype = EventEmitter.prototype;

GameServer.prototype.listen = function () {
	var self = this;
	var args = Array.slice(arguments);
	
	return self.server.listen.apply(server, args);
}

module.exports = GameServer;