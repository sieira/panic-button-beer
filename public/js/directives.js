'use strict';

(function() {
  var app = angular.module('eltast')

  /**
  * The ng-thumb directive
  * @author: nerv
  * @version: 0.1.2, 2014-01-09
  */
  .directive('ngThumb', ['$log', '$window', function($log, $window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function(scope, element, attributes) {
        var canvas = element.find('canvas');

        if (!helper.support) return;

        var params = scope.$eval(attributes.ngThumb);

        if(params.imageData && Object.keys(params.imageData).length > 0) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = 'data:image/jpeg;base64,'+params.imageData.data;
        }

        if (!helper.isFile(params.file)) return;
        if (!helper.isImage(params.file)) return;

        var reader = new FileReader();

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);

        function onLoadFile(event) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = event.target.result;
        }

        function onLoadImage() {
          var width = params.width || this.width / this.height * params.height;
          var height = params.height || this.height / this.width * params.width;
          canvas.attr({ width: width, height: height });
          canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        }
      }
    };
  }])

  .directive('beerNameAvailable', function($q, $http, $log) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link : function(scope, elem, attrs, ctrl) {
        ctrl.$asyncValidators.beerNameAvailable = function (modelValue, viewValue) {
          var deferred = $q.defer();

          /**
           * When editing an existing beer,
           * the name of the beer can be the same
           * than the name of the beer with the
           * same id in the database
           */
          if(scope.beer._id) {
            $http.post('beer-detail/' + scope.beer._id, {})
            .then(function(response) {
              if(response.data.name === modelValue) {
                deferred.resolve();
              }
            });
          }

          $http.post('beer-name-exists/' + modelValue, {})
          .then(function(response) {
            if(response.data) {
              deferred.reject();
            }
            else deferred.resolve();
          }, function(err) {
            $log.error('Error checking beer name availability', err);
            deferred.reject();
          });

          return deferred.promise;
        }
      }
    }
  })

  .directive('validFile',function() {
    function isImage(item) {
      var type = '|' + item.slice(item.lastIndexOf('.') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }

    return {
      require:'ngModel',
      link: function(scope,el,attrs,ctrl) {
        /**
         * When editing an existing beer,
         * there is already an image uploaded,
         * so it passes validation
         **/
        if(scope.beer._id) {
          ctrl.$setValidity('required', true);
          ctrl.$setValidity('valid_file', true);
          return;
        }
        ctrl.$setValidity('required', el.val() != '');
        //change event is fired when file is selected
        el.bind('change',function(){
          ctrl.$setValidity('required', el.val() != '');
          ctrl.$setValidity('valid_file', isImage(el.val()));
          scope.$apply(function(){
            ctrl.$setViewValue(el.val());
            ctrl.$render();
          });
        });
      }
    }
  })

  .directive('beerPreview', function() {
    return {
      restrict : 'E',
      templateUrl : 'beer-preview',
      controller : 'beerPreviewController'
    };
  });
})();
