/**
 * Created by george on 6/14/17.
 */
(function () {
  'use strict';

  console.log(123321);
  angular
    .module('app.core')
    // .controller('contenteditableController', contenteditableControllerFn)
    .directive('contenteditable', contenteditableFn);

  /** @ngInject */
  function contenteditableControllerFn() {
    // Data

    // Methods

    init();
    function init() {

    }
  }

  /** @ngInject */
  function contenteditableFn() {
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, ctrl) {

        // Do nothing if this is not bound to a model
        if (!ctrl) { return; }

        // Checks for updates (input or pressing ENTER)
        // view -> model
        element.bind('input enterKey', function() {
          var rerender = false;
          var html = element.html();

          if (attrs.noLineBreaks) {
            html = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '');
            rerender = true;
          }

          scope.$apply(function() {
            ctrl.$setViewValue(html);
            if(rerender) {
              ctrl.$render();
            }
          });
        });

        element.keyup(function(e){
          if(e.keyCode === 13){
            element.trigger('enterKey');
          }
        });

        // model -> view
        ctrl.$render = function() {
          element.html(ctrl.$viewValue);
        };

        // load init value from DOM
        ctrl.$render();
      }
    };
  }
})();