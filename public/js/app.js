'use strict';

(function() {
	var app = angular.module('eltast', ['ngRoute', 'ui.bootstrap', 'angularFileUpload', 'ngProgress', 'angularModalService'])
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

				resolve: {
					beer: function(beerRetrievalService) {
					return beerRetrievalService.getRandomBeer();
				}}
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
})();
