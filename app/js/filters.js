
(function () {
  'use strict';

  angular.module('myApp.filters', ['myApp.config']).

    filter('round', function($window){
      return function(v) {
        return $window.d3.round(v,1);
      };
    })
    
    ;

})();
