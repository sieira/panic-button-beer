'use strict';

(function() {
  var app = angular.module('eltast')

  .factory('beerEditionService', ['$q', '$http', function($q, $http) {
    return {
      prepareToEdit: function(beer) {
        this.beer = beer;
      },
      prepareToCreate: function() {
        delete this.beer;
      },
      getBeer: function() {
        return this.beer || {};
      },
      getBeerImage: function() {
        var deferred = $q.defer();

        if(!this.beer) {
          deferred.reject({});
        } else {
          $http.get('beer-image/'+ this.beer.img, {})
          .then(function(response) {
            deferred.resolve(response);
          }, function(err) {
            $log.error('Error getting beer image', err);
            deferred.reject({});
          });
        }
        return deferred.promise;
      }
    };
  }])
  .factory('beerRetrievalService', function ($http, $q, $log) {
    return {
      getRandomBeer: function() {
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
      }
    };
   });
})();
