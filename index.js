'use strict';

require('dotenv').load();

var mongoose = require('mongoose'),
    Server = require('./server'),
    server = new Server({ port: process.env.PORT }),
    path = require('path');

var options = {
  db: { native_parser: true },
  user: 'myUserName',
  pass: 'myPassword'
}

mongoose.connect('mongodb://'+ process.env.DB_HOST + '/' + process.env.DB, options);

server.start();
