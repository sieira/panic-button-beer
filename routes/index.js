'use strict';

var BeerController = require('../controllers/beer');

/*
 * GET 404 page
 */
exports._404 = function(req, res){
  res.render('404', { title: 'OOOOPS' });
};

/*
 * GET home page.
 */
exports.index = function(req, res) {
  res.render('index', { title: 'Index' });
};

/**
 * GET panic-button view
 */
exports.panicButton = function(req, res) {
  res.render('views/panic-button', { title: 'Panic Button' });
};

/**
 * GET beer-detail view
 */
exports.beerDetail = function(req, res) {
  BeerController.getBeer(req.params.beerId)
  .then(function(data) {
    if(!data) {
      res.status(404).json(data);
    } else {
      res.status(200).json(data);
    }
  },
  function(err) {
    if(err.name === 'CastError') {
      res.status(400).json({ message: err }); // Bad request
    }
    res.status(418).json({ message: err });
  });
};

exports.beerNameExists = function(req,res) {
  BeerController.beerNameExists(req.params.beerName)
  .then(function(data) {
      res.status(200).json(data);
  });
}

exports.randomBeer = function(req, res) {
  BeerController.getRandomBeer()
  .then(function(data) {
    if(!data) {
      res.status(404).json(data);
    } else {
      res.status(200).json(data);
    }
  },
  function(err) {
    res.status(418).json({ message: err });
  });
};

exports.beerImage = function(req, res) {
  BeerController.getBeerImage(req.params.beerId)
  .then(function(data) {
    res.status(200).json(data);
  },
  function(err) {
    res.status(418).json({ message: err });
  });
};
