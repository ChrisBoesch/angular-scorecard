(function () {
  'use strict';
  
  angular.module('myApp.config', ['ngRoute']).

    constant('TPL_PATH', '/partials').
    constant('API_BASE', '/api/v1').
    config(function($provide){
      var margin={top: 10, right: 50, bottom: 30, left: 50},
        // SVG viewBox dimention (need to be hardcoded in the template).
        // Note: that it scales and only needs to be edited to change proportions.
        width = 720, height=400;

      $provide.value('SVG', {
        margin: margin,
        width: width,
        height: height,
        inWidth: width - margin.left - margin.right,
        inHeight: height - margin.top - margin.bottom
      });
    })

    ;
  
})();