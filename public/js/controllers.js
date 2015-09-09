'use strict';

(function() {
  var app = angular.module('eltast-controllers', ['timer']);

  app.controller('mainController', ['$log', '$scope', function($log, $scope) {
    // create a message to display in our view
    $log.debug('Heme aqui');
    $scope.message = 'Everyone come and see how good I look!';
  }]);

  app.controller('productDetailController', ['$log', '$scope', '$window', function($log, $scope, $window) {
    $scope.timerRunning = true;
    $scope.$broadcast('timer-start');

    $scope.$on('timer-stopped', function (event, data){
      //TODO wait until the end of the bar animation
      $window.location.href = '#/';
    });
  }]);
})();
