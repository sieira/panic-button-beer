'use strict';

require('dotenv').load();

var mongoose = require('mongoose'),
    Server = require('./server'),
    server = new Server({ port: process.env.PORT }),
    path = require('path');

// TODO hacer fullscreen http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
// TODO evitar que pete si no hay birras
mongoose.connect('mongodb://'+ process.env.DB_HOST + '/' + process.env.DB);

server.start();
