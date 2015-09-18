'use strict';

require('dotenv').load();

var mongoose = require('mongoose'),
    Server = require('./server'),
    server = new Server({ port: process.env.PORT }),
    path = require('path');

mongoose.connect('mongodb://'+ process.env.DB_HOST + '/' + process.env.DB);

server.start();
