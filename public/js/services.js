'use strict';

(function() {
  var app = angular.module('eltast-services', [])

  .factory("beerEditionService", function() {
    var beerEditionService = {};

    beerEditionService.prepareToEdit = function(beer) {
      this.beer = beer;
    }

    beerEditionService.prepareToCreate = function() {
      delete this.beer;
    }

    beerEditionService.getBeer = function() {
      return this.beer || {};
    }

    return beerEditionService;
  });

  app.factory('preloadBeerService', ['$http', '$q', function ($http, $q) {
    var deferred = $q.defer();
    var beer = {};

    $http.post('beer-detail', {})
    .then(function(response) {
      beer.beerDetail = response.data;

      $http.get('beer-image/'+ beer.beerDetail.img, {})
      .then(function(response) {
        beer.beerImage = response.data;
        deferred.resolve(beer);
      }, function(err) {
        $log.error('Error getting beer image', err);
        deferred.reject({});
      });
    },
    function(err) {
      $log.error('Error getting random beer', err);
      deferred.reject({});
    });

    return deferred.promise;

  }]);

  /*this.resolve = {
    //TODO preload the detail
    // http://stackoverflow.com/questions/11972026/delaying-angularjs-route-change-until-model-loaded-to-prevent-flicker
    delay: function($q, $timeout) {
      $log.debug('REsolve', 'Im resolve');
      var delay = $q.defer();
      $timeout(delay.resolve, 1000);
      return delay.promise;
    }
  };*/
})();
