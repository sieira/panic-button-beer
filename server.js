'use strict';


/**
* Dependencies
*/
var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    backoffice = require('./routes/backoffice'),
    multer = require('multer'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    authController = require('./controllers/authentication');

function Server(options) {
  var server;
  /**
  * Init stuff
  */
  var app = express(),
      router = express.Router();

  var upload = multer({ storage: multer.memoryStorage() });

  app.set('port', options.port || process.env.PORT || 8080);
  app.set('ip', process.env.HOST || 'localhost');

  app.use(passport.initialize());
  app.use(favicon(path.join(__dirname,'public/img/panic-button-128.png')));

  app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
  app.use(bodyParser.json()); // parse application/json

  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname,'public'));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'bower_components')));

  if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    var logFile = (process.env.LOG_DIR || __dirname) + '/morgan.log';
    var accessLogStream = fs.createWriteStream(logFile, {flags: 'a'})
    app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: accessLogStream }));
  }

  app.get('/', routes.index);
  app.get('/admin', authController.isAuthenticated, backoffice.index);

  app.get('/panic-button', routes.panicButton);

  app.get('/beer-detail', function(req, res) {
    res.render('views/beer-detail', { title: 'Beer' })
  });

  app.post('/beer-detail', routes.randomBeer);
  app.post('/beer-detail/:beerId', routes.beerDetail);
  app.post('/beer-name-exists/:beerName', routes.beerNameExists);

  app.get('/beer-list', authController.isAuthenticated, backoffice.beerList);
  app.get('/beer-preview', authController.isAuthenticated, backoffice.beerPreview);
  app.post('/set-visibility/:beerId', authController.isAuthenticated, backoffice.setVisibility);

  app.get('/edit-beer', authController.isAuthenticated, backoffice.editBeer);
  app.post('/edit-beer', authController.isAuthenticated, backoffice.editBeer);

  app.get('/beerOKmodal', function(req,res) {
    res.render('views/backoffice/beerOKmodal', { title: 'OK' })
  });

  app.delete('/delete-beer/:beerId', authController.isAuthenticated, backoffice.deleteBeer);
  app.post('/undelete-beer/:beerId', authController.isAuthenticated, backoffice.undeleteBeer);

  app.post('/register-beer-image', authController.isAuthenticated, upload.single('file'), backoffice.registerBeerImage);
  app.get('/beer-image/:beerId', routes.beerImage);

  app.get('*', routes._404);

  // Start it up!
  this.start = function() {
    server = app.listen(app.get('port'), app.get('ip'), function() {
      console.log('\x1b[33m' + 'Running in '+ process.env.NODE_ENV + ' mode\x1b[0m');
      console.log('\x1b[32m✔\x1b[0m [%s] Express server listening at %s:%d', Date(Date.now()), app.get('ip'),app.get('port'));
    });
  };

  this.stop = function () {
    server.close(function() {
      console.log('Express server stopped successfully');
    });
  };
}


module.exports = Server;
