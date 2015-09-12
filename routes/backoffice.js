'use strict';

var BeerController = require('../controllers/beer');

/*
 * GET backoffice index
 */
exports.index = function(req, res) {
    res.render('views/backoffice/index', { title: 'Backoffice Index' });
};

exports.beerList = function(req, res) {
  BeerController.beerList()
  .then(function (data) {
    res.status(201).json(data);
  },
  function(err) {
    // TODO handle this error
    res.status(418).json({ message: err });
  });
};

exports.beerPreview = function(req, res) {
  res.render('views/backoffice/beer-preview', { title: 'Beer preview' });
};

exports.setVisibility = function(req, res) {
  BeerController.setVisibility(req.params.beerId, req.body.visibility)
  .then(function (data) {
    res.status(201).json(data);
  },
  function(err) {
    // TODO handle this error
    res.status(418).json({ message: err });
  });
};

/*
 * GET edit-beer
 */
exports.editBeer = function(req, res) {
  if(req.method === "GET") {
    res.render('views/backoffice/edit-beer', { title: 'Edit your beer, dude' });
  } else {
    BeerController.registerBeer(req.body)
    .then(function (data) {
      res.status(201).json(data);
    },
    function(err) {
      // TODO handle this error
      res.status(418).json({ message: err });
    });
  }
};

exports.registerBeerImage = function(req,res) {
  BeerController.registerBeerImage(req.file)
  .then(function (data) {
    res.status(201).json(data);
  },
  function(err) {
    // TODO handle this error
    res.status(418).json({ message: err });
  });
}
