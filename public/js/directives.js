'use strict';

(function() {
  var app = angular.module('eltast-directives', [])

  /**
  * The ng-thumb directive
  * @author: nerv
  * @version: 0.1.2, 2014-01-09
  */
  .directive('ngThumb', ['$window', function($window) {
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
        if (!helper.support) return;

        var params = scope.$eval(attributes.ngThumb);

        if (!helper.isFile(params.file)) return;
        if (!helper.isImage(params.file)) return;

        var canvas = element.find('canvas');
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

  .directive('validBeerName',function(){
    //TODO comprobar que la birra no exista ya, y no validar si el nombre existe
  })

  .directive('validFile',function(){
    function isImage(item) {
      var type = '|' + item.slice(item.lastIndexOf('.') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }

    return {
      require:'ngModel',
      link: function(scope,el,attrs,ctrl) {
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
