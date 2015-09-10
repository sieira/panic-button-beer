'use strict';

(function() {
  var app = angular.module('eltast-controllers', ['ui.bootstrap', 'angularFileUpload', 'timer']);

  app.controller('mainController', ['$log', '$scope', function($log, $scope) {
    // create a message to display in our view
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

  app.controller('editBeerController', ['$log', '$scope', 'FileUploader', function($log, $scope, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
      url: 'upload.php'
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.editBeer = function(beer) {
      //TODO comprobar que la birra no exista ya, y no validar si el nombre existe
        $log.debug('por aqui paso ->' + JSON.stringify(beer));
    }
  }]);
})();
