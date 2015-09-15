'use strict';

(function() {
  var app = angular.module('eltast-controllers', ['eltast-services', 'ui.bootstrap', 'angularFileUpload', 'timer'])

  .filter('html', ['$sce', function($sce) {
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }])

  /**
   * Home page controller
   */
  .controller('mainController', ['$rootScope', function($rootScope) {
    $rootScope.showHeader = false;
    /*
     * TODO Animate the button on click
     */
  }])

  .controller('backofficeController', ['$log', '$rootScope', '$scope', '$http', '$location', 'beerEditionService', function($log, $rootScope, $scope, $http, $location, beerEditionService) {
    $rootScope.showHeader = true;

    $http.get('beer-list')
    .then(function(response) {
      $scope.beerList = response.data;
    }, function(err) {
      $log.error('Error getting beer list', err);
    });

    $scope.createBeer = function() {
      beerEditionService.prepareToCreate();
      $location.path('edit-beer');
    };
  }])

  .controller('beerPreviewController', ['$log', '$scope', '$http', '$location', 'beerEditionService', function($log, $scope, $http, $location, beerEditionService) {
    $scope.switchVisibility = function() {
      $http.post('set-visibility/' + $scope.beer._id, { visibility : !$scope.beer.visible })
      .then(function(response) {
        $scope.beer.visible = !$scope.beer.visible;
      }, function(err) {
        $log.error('Error setting visibility', err);
      });
    };

    $scope.editBeer = function() {
      beerEditionService.prepareToEdit($scope.beer);
      $location.path('edit-beer');
    };

    $scope.deleteBeer = function() {
      $http.delete('delete-beer/' + $scope.beer._id)
      .then(function(response) {
        //TODO set a timer so the beer is removed from the list when it's expired
        $scope.beer.expireAt = response.data.expireAt;
      }, function(err) {
        $log.error('Error deleting beer', err);
      });
    };

    $scope.undeleteBeer = function() {
      $http.post('undelete-beer/' + $scope.beer._id)
      .then(function(response) {
        delete $scope.beer.expireAt;
      }, function(err) {
        $log.error('Error restoring beer', err);
      });
    };
  }])

  .controller('productDetailController', ['$log', '$rootScope', '$scope', '$http', '$window', function($log, $rootScope, $scope, $http, $window) {
    $rootScope.showHeader = true;

    $http.post('beer-detail', {})
    .then(function(response) {
      var beer = $scope.beer = response.data;

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

    $scope.$on('timer-stopped', function(event, data){
      //TODO wait until the end of the bar animation
      $window.location.href = '#/';
    });
  }])

  .controller('editBeerController', ['$log', '$rootScope', '$scope', '$http', 'FileUploader', 'beerEditionService', function($log, $rootScope, $scope, $http, FileUploader, beerEditionService) {
    $rootScope.showHeader = true;
    $scope.beer = beerEditionService.getBeer();

    // TODO preload the registered image if beer is not {} or has an _id
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
        beer.img = response;

        $http.post('edit-beer', beer)
          .then(function(response) {
            //TODO redirect to admin index
            $log.debug('status', response);
          },
          function(err) {
            $log.error('Error editing beer', err);
            // TODO Delete the uploaded image
          });
      };

      uploader.onErrorItem = function(item, response, status, headers) {
        //TODO inform the user
        $log.error('An error uploading the image :' + response.message);
      };
    }
  }]);
})();
