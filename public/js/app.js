'use strict';

(function() {
	var app = angular.module('eltast', ['eltast-controllers', 'ngRoute']);

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
				//               controller  : 'productDetailController'
				controller  : 'productDetailController'
			})
			.otherwise({
				templateUrl : '/404'
			});
   }]);
})();
