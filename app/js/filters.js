
(function () {
  'use strict';

  angular.module('myApp.filters', ['myApp.config']).

    filter('round', function($window){
      return function(v, p) {
        p = p || 0;
        return $window.d3.round(v,p);
      };
    })
    
    ;

})();
