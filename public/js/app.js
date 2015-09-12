'use strict';

(function() {
	var app = angular.module('eltast', ['eltast-controllers', 'eltast-directives', 'ngRoute'])

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
			.when('/product-detail', {
				templateUrl : '/product-detail',
				controller  : 'productDetailController'
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
