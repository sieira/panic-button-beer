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
 * GET product-detail view
 */
exports.productDetail = function(req, res) {
    if(req.method === "GET") {
      res.render('views/product-detail', { title: 'Beer' });
    } else {
      BeerController.getRandomBeer()
      .then(function (data) {
        res.status(200).json({ message: data });
      },
      function(err) {
        // TODO handle this error
        res.status(418).json({ message: err });
      });
    }
};

exports.beerImage = function(req, res) {
  BeerController.getBeerImage(req.params.beerId)
  .then(function (data) {
    res.status(200).json(data);
  },
  function(err) {
    // TODO handle this error
    res.status(418).json({ message: err });
  });
};
