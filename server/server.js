'use strict';


var net = require('net');

var express = require('express');
var chalk = require('chalk');
var config = require('./config/environment');

var app = express();
var server = require('http').createServer(app);
var serverGame = require('server-game');

require('./config/express')(app);
require('./routes')(app);

serverGame.listen(config.game.port function () {
  console.log(
    chalk.red('\nGaming server listening on port ')
    + chalk.yellow('%d'),
    config.game.port
  );
});

server.listen(config.port, config.ip, function () {

  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

  if (config.env === 'development') {
    require('ripe').ready();
  }

});

module.exports = server;
