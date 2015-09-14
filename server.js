'use strict';


/**
* Dependencies
*/
var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    logger = require('morgan')('combined'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    backoffice = require('./routes/backoffice'),
    multer = require('multer');

var port = process.env.PORT || 8080,
    server;

/**
* Init stuff
*/
var app = express(),
router = express.Router(),
upload = multer({ storage: multer.memoryStorage() });

mongoose.connect('mongodb://localhost/eltast');

app.set('port', port);
app.set('views', path.join(__dirname,'/public'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', routes.index);
app.get('/admin', backoffice.index);

app.get('/panic-button', routes.panicButton);

app.get('/product-detail', routes.productDetail);
app.post('/product-detail', routes.productDetail);

app.get('/beer-list', backoffice.beerList);
app.get('/beer-preview', backoffice.beerPreview);
app.post('/set-visibility/:beerId', backoffice.setVisibility);

app.get('/edit-beer', backoffice.editBeer);
app.post('/edit-beer', backoffice.editBeer);


app.post('/register-beer-image', upload.single('file'), backoffice.registerBeerImage);
app.get('/beer-image/:beerId', routes.beerImage);

app.get('*', routes._404);


// Start it up!
function start() {
  server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
}

function stop() {
  server.close(function() {
    console.log('Express server stopped successfully');
  });
}



module.exports = {
  start: start,
  stop: stop
}
