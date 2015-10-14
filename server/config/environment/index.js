'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  game: {
  	port: process.env.GAME_PORT || 4242,
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
