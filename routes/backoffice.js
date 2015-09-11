'use strict';

var BeerController = require('../controllers/beer');

/*
 * GET backoffice index
 */
exports.index = function(req, res){
    res.render('views/backoffice/index', { title: 'Backoffice Index' });
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
      res.status(201).json({ message: data });
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
    res.status(201).json({ message: data });
  },
  function(err) {
    // TODO handle this error
    res.status(418).json({ message: err });
  });
}
