'use strict';

var q = require('q'),
    marked = require('marked'),
    Beer = require('../models/beer'),
    BeerImage = require('../models/beer-image');


exports.beerList = function() {
  var deferred = q.defer();

  Beer.find({}, function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

exports.setVisibility = function(id, visibility) {
  var deferred = q.defer();

  Beer.update({ _id : id }, { visible: visibility }, function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

/*
 * POST register beer
 */
exports.editBeer = function(item) {
  var deferred = q.defer();
	var beer = new Beer(item);

  // Register or update beer
  beer.save(function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data._id);
    }
	});
  return deferred.promise;
};

/*
 * POST register beer
 */
 exports.registerBeerImage = function(image) {
  var deferred = q.defer();

	var beerImage = new BeerImage({ img: { data: image.buffer } });

  // Register new beer
  beerImage.save(function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data._id);
    }
	});
  return deferred.promise;
};

exports.getRandomBeer = function() {
  var deferred = q.defer();

  Beer.count({ visible: true }, function(err,count) {
    if(err) {
      deferred.reject(err);
    } else {
      var rand = Math.floor(Math.random() * count);

      Beer.findOne({ visible: true }).skip(rand).exec(function(err, beer) {
        beer.description = marked(beer.description);
        beer.kind = marked(beer.kind);
        deferred.resolve(beer);
      });
    }
  });

  return deferred.promise;
}

exports.getBeer = function(beerId) {
  var deferred = q.defer();

  Beer.findOne({ _id: beerId }, function(err, beer) {
    if(err) {
      deferred.reject(err);
    } else {
      beer.description = marked(beer.description);
      beer.kind = marked(beer.kind);
      deferred.resolve(beer);
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
      var data = new Buffer(beerImage.img.data).toString('base64');
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};
