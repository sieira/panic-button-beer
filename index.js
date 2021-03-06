'use strict';

require('dotenv').load();

var mongoose = require('mongoose'),
    Server = require('./server'),
    server = new Server({ port: process.env.PORT }),
    path = require('path');

var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/';

mongoose.connect(dbUrl + process.env.DB);

var options = {
  port:  process.env.PORT || 8080
};

server.start(options);
