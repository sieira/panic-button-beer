'use strict';

(function() {
  var app = angular.module('eltast-services', [])

  .factory("beerEditionService", function() {
    var beerEditionService = {};

    beerEditionService.prepareToEdit = function (beer) {
      this.beer = beer;
    }

    beerEditionService.prepareToCreate = function () {
      delete this.beer;
    }

    beerEditionService.getBeer = function() {
      return this.beer || {};
    }

    return beerEditionService;
  });
})();
