'use strict';

(function() {
	var app = angular.module('eltast', ['eltast-controllers', 'eltast-directives', 'ngRoute']);

  app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : '/panic-button',
				controller  : 'mainController'
			})

			// route for the beer-details page
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
				controller  : 'editBeerController'
			})
			.otherwise({
				templateUrl : '/404'
			});
   }]);
})();
