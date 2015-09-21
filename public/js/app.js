'use strict';

(function() {
	var app = angular.module('eltast', ['ngRoute', 'ui.bootstrap', 'angularFileUpload', 'ngProgress'])
  .config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
			/*
			 *  Routes
			 */
			.when('/', {
				templateUrl : '/panic-button',
				controller  : 'homeController'
			})
			.when('/beer-detail', {
				templateUrl : '/beer-detail',
				controller  : 'productDetailController',
				/**
					TODO
						This line should be :
							resolve: { beer: beerRetrievalService.getRandomBeer }
							you need to export the service as an object
				*/
				resolve: { beer: factory }
			})
			.when('/admin', {
				templateUrl : '/admin',
				controller  : 'backofficeController'
			})
			.when('/edit-beer', {
				templateUrl : '/edit-beer',
				controller  : 'editBeerController'
			})
			.when('/beer-image/:_id', {
				templateUrl : '/beer-image/:_id',
			})
			.otherwise({
				templateUrl : '/404'
			});
   }]);

	 function factory($http, $q, $log) {
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
})();
