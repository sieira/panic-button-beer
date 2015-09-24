'use strict';

(function() {
  var app = angular.module('eltast')

  .filter('html', ['$sce', function($sce) {
      return function(text) {
          return $sce.trustAsHtml(text);
      };
  }])

  /**
   * Home page controller
   */
  .controller('homeController', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window) {
    $rootScope.showHeader = false;

    $scope.load = function() {
      $scope.spinning = true;
      $window.location.href = '#/beer-detail';
    };
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

  .controller('productDetailController', ['$log', '$rootScope', '$scope', '$http', '$window', 'ngProgressFactory', 'beer', function($log, $rootScope, $scope, $http, $window, ngProgressFactory, beer) {
    $rootScope.showHeader = true;

    var timeToGo = 10000,
        tick = 10,
        elapsed = 0;

    $scope.beer = beer.beerDetail;
    $scope.image = beer.beerImage;

    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor('#1E90FF');
    $scope.progressbar.setHeight('4px');
    $scope.progressbar.setParent(document.getElementById('progress'))

    var timeout = setInterval(function() {
      if ($scope.progressbar.status() >= 100) {
        clearTimeout(timeout);
        $window.location.href = '#/';
      }
      else {
        elapsed += tick;
        $scope.progressbar.set((elapsed / timeToGo) * 100);
      }
    }, tick);

    /**
     * Clear the timer if the user exits the view
     */
    $rootScope.$on('$locationChangeSuccess', function() {
        clearTimeout(timeout);
    });
  }])

  .controller('editBeerController', ['$log', '$rootScope', '$scope', '$http', '$location', 'FileUploader', 'beerEditionService', 'ModalService', function($log, $rootScope, $scope, $http, $location, FileUploader, beerEditionService, ModalService) {
    $rootScope.showHeader = true;

    var uploader = $scope.uploader = new FileUploader({
      url: 'register-beer-image'
    });

    var beer = $scope.beer = beerEditionService.getBeer();

    beerEditionService.getBeerImage()
    .then(function(response) {
      $scope.beerImage = uploader.queue[0] = response;
      // Overrides the angular-file-upload destroy method so it doesn't fail
      uploader.queue[0]._destroy = function() { };
      // Override upload method so it doesn't do anything and doesn't fail
      uploader.queue[0].upload = function() { uploader.onSuccessItem(null, $scope.beer.img); };
    }, function() {
      $scope.beerImage = {};
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item, options) {
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

    $scope.editBeer = function() {
      if($scope.form.$invalid) return;

      uploader.onSuccessItem = function(item, response, status, headers) {
        beer.img = response;
        $http.post('edit-beer', beer)
          .then(function(response) {
            ModalService.showModal({
              templateUrl: 'beerOKmodal',
              controller: 'ModalController'
            })
            .then(function(modal) {
              modal.element.modal();
              modal.close.then(function(result) {
                $location.path('admin');
              });
            });
          },
          function(err) {
            $log.error('Error editing beer', err);
            // TODO Delete the uploaded image
          });
      };

      uploader.onErrorItem = function(item, response, status, headers) {
        alert('An error ocurred while uploading the image');
        $log.error('An error ocurred uploading the image :' + response.message);
      };

      uploader.queue[0].upload();
    }
  }])

  .controller('ModalController', function($scope, close) {
    $scope.close = function(result) {
 	    close(result, 500); // close, but give 500ms for bootstrap to animate
    };
  });
})();
