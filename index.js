'use strict';

var mongoose = require('mongoose'),
    server = require('./server');

    
// TODO hacer fullscreen http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr

mongoose.connect('mongodb://localhost/eltast');

server.start();
