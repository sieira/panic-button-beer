'use strict';

/**
 * Dependencies
 */
var express = require('express'),
    path = require('path'),
    logger = require('morgan')('combined'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    backoffice = require('./routes/backoffice');

var port = process.env.PORT || 8080;

/**
 * Init stuff
 */
var app = express(),
    router = express.Router();

app.set('port', port);
app.set('views', path.join(__dirname,'/public'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', routes.index);
app.get('/panic-button', routes.panicButton);
app.get('/product-detail', routes.productDetail);
app.get('/admin', backoffice.index);
app.get('/edit-beer', backoffice.editBeer);
app.post('/edit-beer', backoffice.editBeer);
app.get('*', routes._404);


// Start it up!
app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
