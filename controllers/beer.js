'use strict';

var q = require('q'),
    marked = require('marked'),
    moment = require('moment'),
    config = require('../config'),
    Beer = require('../models/beer'),
    BeerImage = require('../models/beer-image');

var gracePeriod = config.gracePeriod;

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
	var beer = new Beer(item).toObject();

  var id = beer._id;
  delete beer._id;

  // Register or update beer
  Beer.update({ _id: id }, beer, { upsert: true, multi: false }, function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      if(data.upserted)  {
        deferred.resolve(data.upserted[0]._id);
      } else deferred.resolve(data._id);
    }
	});
  return deferred.promise;
};

/*
 * POST register beer
 */
 exports.registerBeerImage = function(image, id) {
  var deferred = q.defer();

	var beerImage = new BeerImage({ img: { data: image.buffer } });

  if(id) {
    beerImage._id = id;
  }

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

exports.beerNameExists = function(beerName) {
  var deferred = q.defer();

  Beer.count({ name : beerName }, function(err, count) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(count > 0);
    }
  });

  return deferred.promise;
};

exports.getRandomBeer = function() {
  var deferred = q.defer();

  Beer.count({ visible: true }, function(err, count) {
    if(err) {
      deferred.reject(err);
    } else {
      var rand = Math.floor(Math.random() * count);

      Beer.findOne({ visible: true }).skip(rand).exec(function(err, beer) {
        if(err) {
          deferred.reject(err);
        } else if(beer) {
          beer.description = marked(beer.description);
          beer.kind = marked(beer.kind);
        }
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
    } else if (beer) {
      beer.description = marked(beer.description);
      beer.kind = marked(beer.kind);
    }
    deferred.resolve(beer);
  });

  return deferred.promise;
};

exports.getBeerImage = function(id) {
  var deferred = q.defer();

  function _getBeerImage() {
    BeerImage.findOne({ _id : id }, function(err, beerImage) {
      if(err) {
        deferred.reject(err);
      } else {
        var data = new Buffer(beerImage.img.data).toString('base64');
        deferred.resolve(data);
      }
    });
  }

  /**
   * Simulates a delay in case the development mode is active
   */
  if(process.env.NODE_ENV === 'development') {
    setTimeout(function(){
      _getBeerImage();
    },config.transmissionDelay);
  } else {
    _getBeerImage();
  }

  return deferred.promise;
};

/**
 * Requests mongoDB to delete the image after gracePeriod time
 */
exports.deleteBeerImage = function(id) {
  var deferred = q.defer();

  BeerImage.update({ _id : id }, { expireAt: moment().add(gracePeriod.n, gracePeriod.unit) }, function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

exports.undeleteBeerImage = function(id) {
  var deferred = q.defer();

  BeerImage.update({ _id : id }, { $unset: { expireAt: 1 } }, function(err, data) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

/**
 * Requests mongoDB to delete the beer and it's associated image after gracePeriod time
 */
exports.deleteBeer = function(id) {
  var deferred = q.defer();

  Beer.findByIdAndUpdate({ _id: id }, { expireAt: moment().add(gracePeriod.n, gracePeriod.unit) }, { new: true }, function(err, beer) {
    if(err) {
      deferred.reject(err);
    }

    exports.deleteBeerImage(beer.img)
    .then(function(data) {
      deferred.resolve(beer);
    })
    .fail(function(err) {
      deferred.reject(err)
    });
  });

  return deferred.promise;
};

exports.undeleteBeer = function(id) {
  var deferred = q.defer();

  Beer.findByIdAndUpdate({ _id: id }, { $unset: { expireAt: 1 }}, { new: true }, function(err, beer) {
    if(err) {
      deferred.reject(err);
      return;
    }

    exports.undeleteBeerImage(beer.img)
    .then(function(data) {
      deferred.resolve(beer);
    })
    .fail(function(err) {
      deferred.reject(err)
    });
  });

  return deferred.promise;
};
