'use strict';

(function() {
	var app = angular.module('eltast', ['eltast-controllers', 'eltast-directives', 'eltast-services', 'ngRoute'])
  .config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
			/*
			 *  Routes
			 */
			.when('/', {
				templateUrl : '/panic-button',
				controller  : 'mainController'
			})
			.when('/beer-detail', {
				templateUrl : '/beer-detail',
				controller  : 'productDetailController',
				resolve: { beer: 'preloadBeerService' }
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
