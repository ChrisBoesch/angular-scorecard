(function () {
  'use strict';
  
  angular.module('myApp.config', ['ngRoute']).

    constant('TPL_PATH', 'partials').
    constant('API_BASE', '/api/v1/scoreboard/charts').
    constant('SVG_HEIGHT', 400).
    constant('SVG_WIDTH', 720).
    constant('SVG_MARGIN', {top: 10, right: 30, bottom: 30, left: 70}).
    factory('SVG', function(SVG_HEIGHT, SVG_WIDTH, SVG_MARGIN) {
      return function(margin, width, height) {
        margin = margin || SVG_MARGIN;
        width = width || SVG_WIDTH;
        height = height || SVG_HEIGHT;

        return {
          margin: margin,
          width: width,
          height: height,
          inWidth: width - margin.left - margin.right,
          inHeight: height - margin.top - margin.bottom
        };
      };
    })

    ;
  
})();