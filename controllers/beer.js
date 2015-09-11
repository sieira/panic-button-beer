'use strict';

var q = require('q'),
    marked = require('marked'),
    Beer = require('../models/beer'),
    BeerImage = require('../models/beer-image');

/*
 * POST register beer
 */
exports.registerBeer = function(item) {
  var deferred = q.defer();
	var beer = new Beer(item);

  // Register new beer
  beer.save(function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data._id);
    }
	});
  return deferred.promise
};

/*
 * POST register beer
 */
exports.registerBeerImage = function(image) {
  var deferred = q.defer();
  console.log(image);
	var beerImage = new BeerImage({ img: { data: image.buffer } });

  // Register new beer
  beerImage.save(function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data._id);
    }
	});
  return deferred.promise
};

exports.getRandomBeer = function() {
  var deferred = q.defer();

  Beer.count(function(err,count) {
    if(err) {
      deferred.reject(err);
    } else {
      var rand = Math.floor(Math.random() * count);

      Beer.findOne().skip(rand).exec(function(err, beer) {
        beer.description = marked(beer.description);
        deferred.resolve(beer);
      });
    }
  });

  return deferred.promise;
};

exports.getBeerImage = function(id) {
  var deferred = q.defer();

  BeerImage.findOne({ _id : id }).exec(function(err, beerImage) {
    if(err) {
      deferred.reject(err);
    } else {
      var data = new Buffer(beerImage.img.data).toString('base64')
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};
