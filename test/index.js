'use strict'

//TODO test frontend http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
require('dotenv').load();

var hostname = process.env.TEST_HOST,
    port = process.env.TEST_PORT;

var should = require('chai').should(),
    fs = require('fs'),
    request = require('request'),
    Server = require('../server'),
    server = new Server({ port: port }),
    mongoose = require('mongoose'),
    querystring = require('querystring'),
    mocha_mongoose = require('mocha-mongoose');

var dbURI = 'mongodb://'+ process.env.DB_HOST + '/' + process.env.TEST_DB,
    clearDB  = mocha_mongoose(dbURI,{ noClear : true });

mongoose.connect(dbURI);

describe('# Backend', function() {
  describe('# Database', function() {
    var beers,
        beerImages,
        beerId,
        beerImageId,
        deletedBeer;

    before(function(done) {
      clearDB(done);
    });

    before(function(done) {
      server.start();
      done();
    });

    before(function(done) {
      fs.readFile('test/beers.json', { encoding : 'utf8' }, function(err,data) {
        if(err) should.fail(0,1,'Error reading example beers file ' + err);
        beers = JSON.parse(data);
        done();
      });
    });

    before(function(done) {
      fs.readFile('test/beer-images.json',{ encoding : 'utf8' }, function(err,data) {
        if(err) should.fail(0,1,'Error reading example beer images file' + err);
        beerImages = JSON.parse(data);
        done();
      });
    });

    after(function(done) {
      server.stop();
      done();
    });

    it('Getting a beer when there is none should return 404 and not fail', function (done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/beer-detail',
        encoding: 'utf8'
      };

      request.post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(404);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem getting unexistant beer: ' + e.message);
      })
      .on('data', function(data) {
        should.equal(JSON.parse(data), null);
        done();
      })
    });

    it('Inserting test images should not fail', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/register-beer-image',
        encoding: 'utf8'
      };

      var n = beerImages.length;

      beerImages.forEach(function(beerImage, index) {
        request.post(options)
        .on('response', function(res) {
          res.statusCode.should.equal(201);
        })
        .on('error', function(e) {
          should.fail(0,1,'Problem registering image: ' + e.message);
        })
        .on('data', function(data) {
          beers[index].img = JSON.parse(data);
          if (--n === 0) {
            beerImageId = JSON.parse(data);
            done(); // Exit the test when all images have been inserted
          }
        })
        .form().append('file', new Buffer(beerImage, 'base64'), { filename: 'test', contentType: 'image/*' });
      });
    });

    it('Inserting test beers should not fail', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/edit-beer'
      };

      var n = beers.length;

      beers.forEach(function(beer, index) {
        var postData = querystring.stringify(beer);

        request.post(options)
        .form(postData)
        .on('response', function(res) {
          res.statusCode.should.equal(201);
        })
        .on('error', function(e) {
          should.fail(0,1,'Problem registering beer: ' + e.message);
        })
        .on('data', function(data) {
          if(--n === 0) {
            beerId = JSON.parse(data);
            done(); // Exit the test when all beers have been inserted
          };
        });
      });
    });

    it('Getting a beer none is visible should return 404 and not fail', function (done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/beer-detail',
        encoding: 'utf8'
      };

      request.post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(404);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem getting unexistant beer: ' + e.message);
      })
      .on('data', function(data) {
        should.equal(JSON.parse(data), null);
        done();
      })
    });

    it('Should change beer visibility', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/set-visibility/' + beerId,
        encoding: 'utf8'
      };

      var postData = {
        visibility: true
      }

      request
      .post(options)
      .form(postData)
      .on('response', function(res) {
        res.statusCode.should.equal(201);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem setting visibility: ' + e.message);
      });

      options = {
        uri: 'http://' + hostname + ':' + port  + '/beer-detail/' + beerId,
        encoding: 'utf8'
      };

      request
      .post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(200);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem getting beer: ' + e.message);
      })
      .on('data', function(data) {
        JSON.parse(data).visible.should.equal(true);
        done();
      });
    });

    it('Getting a beer when at least one is visible should return the beer and not fail', function (done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/beer-detail',
        encoding: 'utf8'
      };

      request.post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(200);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem getting unexistant beer: ' + e.message);
      })
      .on('data', function(data) {
        should.not.equal(JSON.parse(data), null);
        done();
      })
    });

    it('Getting a nonexistant beer return 404 and not fail', function (done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/beer-detail/' + mongoose.Types.ObjectId(),
        encoding: 'utf8'
      };

      request.post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(404);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem getting unexistant beer: ' + e.message);
      })
      .on('data', function(data) {
        should.equal(JSON.parse(data), null);
        done();
      })
    });

    it('Should mark a beer for deletion', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/delete-beer/' + beerId,
        encoding: 'utf8'
      };

      request
      .del(options)
      .on('response', function(res) {
        var body ='';

        res.statusCode.should.equal(200);

        res
        .on('data', function(data) {
          should.exist(JSON.parse(data).expireAt);
          done();
        })
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem deleting beer : ' + e.message);
      });
    });

    it('Should be able to cancel the beer\'s deletion', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/undelete-beer/' + beerId
      };

      request.post(options)
      .on('response', function(res) {
        res.statusCode.should.equal(200);
      })
      .on('error', function(e) {
        should.fail(0,1,'Problem restoring beer: ' + e.message);
      })
      .on('data', function(data) {
        JSON.parse(data)._id.should.equal(beerId);
        done();
      });
    });
  });
});
