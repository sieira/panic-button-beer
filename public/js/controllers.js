'use strict';

(function() {
  var app = angular.module('eltast-controllers', ['ui.bootstrap', 'angularFileUpload', 'timer'])

  .filter('html', ['$sce', function ($sce) {
      return function (text) {
          return $sce.trustAsHtml(text);
      };
  }])

  /**
   * Home page controller
   */
  .controller('mainController', ['$rootScope', function($rootScope) {
    $rootScope.showHeader = false;
    /*
     * TODO
     * Animate the button on click
     */
  }])

  .controller('backofficeController', ['$log', '$rootScope', '$scope', '$http', function($log, $rootScope, $scope, $http) {
    $rootScope.showHeader = true;

    $http.get('beer-list')
    .then(function(response) {
      $scope.beerList = response.data;
    }, function(err) {
      $log.error('Error getting beer list', err);
    });
  }])

  .controller('beerPreviewController', ['$log', '$scope', '$http', function($log, $scope, $http) {
    $scope.switchVisibility = function() {
      $http.post('set-visibility/' + $scope.beer._id, { visibility : !$scope.beer.visible })
      .then(function(response) {
        $log.debug('Response', response);
        $scope.beer.visible = !$scope.beer.visible;
      }, function(err) {
        $log.error('Error setting visibility', err);
      });
    }
  }])

  .controller('productDetailController', ['$log', '$rootScope', '$scope', '$http', '$window', function($log, $rootScope, $scope, $http, $window) {
    $rootScope.showHeader = true;

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
  }])

  .controller('editBeerController', ['$log', '$rootScope', '$scope', '$http', 'FileUploader', function($log, $rootScope, $scope, $http, FileUploader) {
    $rootScope.showHeader = true;

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
