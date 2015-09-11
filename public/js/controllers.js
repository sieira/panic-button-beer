'use strict';

(function() {
  var app = angular.module('eltast-controllers', ['ui.bootstrap', 'angularFileUpload', 'timer']);

  app.filter('html', ['$sce', function ($sce) {
      return function (text) {
          return $sce.trustAsHtml(text);
      };
  }])

  app.controller('mainController', ['$log', '$scope', function($log, $scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
  }]);

  app.controller('productDetailController', ['$log', '$scope', '$http', '$window', function($log, $scope, $http, $window) {
    $http.post('product-detail', {})
    .then(function(response) {
      var beer = $scope.beer = response.data.message;

      $http.get('beer-image/'+ beer.img, {})
      .then(function(response) {
        $scope.image = response.data;
      }, function(err) {
        $log.error('Error getting beer image', err);
      });
    },
    function(err) {
      $log.error('Error getting random beer', err);
    });

    $scope.timerRunning = true;
    $scope.$broadcast('timer-start');

    $scope.$on('timer-stopped', function (event, data){
      //TODO wait until the end of the bar animation
      $window.location.href = '#/';
    });
  }]);

  app.controller('editBeerController', ['$log', '$scope', '$http', 'FileUploader', function($log, $scope, $http, FileUploader) {
    $.fn.bootstrapSwitch.defaults.onText = 'YES';
  	$.fn.bootstrapSwitch.defaults.offText = 'NO';
  	$.fn.bootstrapSwitch.defaults.size = 'mini';

  	angular.element(":checkbox").bootstrapSwitch();

    var uploader = $scope.uploader = new FileUploader({
      url: 'register-beer-image'
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onWhenAddingFileFailed = function(fileItem) {
      alert('The file has to be an image');
      uploader.clearQueue();
    };

    uploader.onAfterAddingFile = function(fileItem) {
      if(uploader.queue.length > 1)
        uploader.removeFromQueue(uploader.queue[0]);
    };

    $scope.editBeer = function(beer) {
      if($scope.form.$invalid) return;

      uploader.queue[0].upload();

      uploader.onSuccessItem = function(item, response, status, headers) {
        beer.img = response.message;

        $http.post('edit-beer', beer)
          .then(function(response) {
            //TODO redirige a la lista de birras
            $log.debug('status', response);
          },
          function(err) {
            $log.error('Error editing beer', err);
            /**
              TODO
              Delete the uploaded image
             */
          });
      };

      uploader.onErrorItem = function(item, response, status, headers) {
        console.log('ERROR !');
        console.log(response);
      };
    }
  }]);
})();
