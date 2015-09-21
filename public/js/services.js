'use strict';

(function() {
  var app = angular.module('eltast')

  .factory('beerEditionService', function() {
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
  })
  .factory('beerRetrievalService', function ($http, $q, $log) {
     beerRetrievalService.getRandomBeer = function() {
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
     };

     return beerRetrievalService;
   });
})();
