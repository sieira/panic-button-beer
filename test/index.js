'use strict'

var should = require('chai').should(),
    fs = require('fs'),
    request = require('request'),
    server = require('../server');

var hostname = 'localhost',
    port = 8080;

describe('# Backend', function() {
  describe('# Database', function() {
    var beers,
    beerImages;

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
        if(err) should.fail(0,1,'Error reading example beers file' + err);
        beerImages = JSON.parse(data);
        done();
      });
    });

    after(function(done) {
      server.stop();
      done();
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
          should.fail(0,1,'Problem registaring image: ' + e.message);
        })
        .on('data', function(data) {
          beers[index].img = data.slice(1,-1);
          if (--n === 0) done(); // Exit the test when all images have been inserted
        })
        .form().append('file', beerImage, { filename: 'test', contentType: 'image/*' });
      });
    });

    it('Inserting test beers should not fail', function(done) {
      var options = {
        uri: 'http://' + hostname + ':' + port  + '/edit-beer',
        encoding: 'utf8'
      };

      var n = beers.length;

      beers.forEach(function (beer, index) {
        var postData = beer;

        request.post(options)
        .form(postData)
        .on('response', function(res) {
          // res.statusCode.should.equal(201);
        })
        .on('error', function(e) {
          should.fail(0,1,'Problem registaring beer: ' + e.message);
        })
        .on('data', function(data) {
          if(--n === 0) done(); // Exit the test when all beers have been inserted
        });
      });
    });
  });
});
