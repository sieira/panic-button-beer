'use strict';

require('dotenv').load();

var mongoose = require('mongoose'),
    Server = require('./server'),
    server = new Server({ port: process.env.PORT }),
    path = require('path');

var options = {
  db: { native_parser: true },
  user: process.env.DB_USER || undefined,
  pass: process.env.DB_PASSWORD || undefined
}

mongoose.connect('mongodb://'+ process.env.DB_HOST + '/' + process.env.DB, options);

server.start();
