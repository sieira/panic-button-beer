'use strict';


/**
* Dependencies
*/
var express = require('express'),
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

app.set('port', port);
app.set('views', path.join(__dirname,'/public'));
app.set('view engine', 'jade');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/', routes.index);
app.get('/admin', backoffice.index);

app.get('/panic-button', routes.panicButton);

app.get('/beer-detail', routes.beerDetail);
app.post('/beer-detail', routes.randomBeer);
app.post('/beer-detail/:beerId', routes.beerDetail);

app.get('/beer-list', backoffice.beerList);
app.get('/beer-preview', backoffice.beerPreview);
app.post('/set-visibility/:beerId', backoffice.setVisibility);

app.get('/edit-beer', backoffice.editBeer);
app.post('/edit-beer', backoffice.editBeer);
app.delete('/delete-beer/:beerId', backoffice.deleteBeer);
app.post('/undelete-beer/:beerId', backoffice.undeleteBeer);


app.post('/register-beer-image', upload.single('file'), backoffice.registerBeerImage);
app.get('/beer-image/:beerId', routes.beerImage);

app.get('*', routes._404);


// Start it up!
function start(port) {
  server = app.listen(port || app.get('port'), function() {
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
