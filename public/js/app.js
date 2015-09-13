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
			.when('/product-detail', {
				templateUrl : '/product-detail',
				controller  : 'productDetailController',
				resolve: {
					//TODO preload the detail
					// http://stackoverflow.com/questions/11972026/delaying-angularjs-route-change-until-model-loaded-to-prevent-flicker
					delay: function($q, $timeout) {
						var delay = $q.defer();
						$timeout(delay.resolve, 1000);
						return delay.promise;
					}
				}
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
