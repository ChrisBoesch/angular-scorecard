
(function () {
  'use strict';

  angular.module('myApp.filters', ['myApp.config']).

    filter('round', function($window){
      return function(v, p) {
        p = p || 0;
        return $window.d3.round(v,p);
      };
    }).

    filter('points', function(){
      return function(v, xScale, yScale) {
        var result = [], xDomain = xScale.domain();

        v.forEach(function(v,k){
          this.push([xScale(xDomain[k]),yScale(v)].join(','));
        }, result);

        return result.join(' ');
      };
    })
    
    ;

})();
