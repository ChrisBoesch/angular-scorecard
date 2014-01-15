(function () {
'use strict';

  angular.module('myApp.controllers', ['myApp.config']).

    controller('HomeCtrl', function ($scope, $window) {
      var setSvg,
        d3 = $window.d3,
        // TODO: mock api call
        data = [
          {name: 'AA', values: [48, 15, 57, 57, 10, 19, 69, 99, 81, 72]},
          {name: 'BBB', values: [4, 100, 37, 9, 46, 77, 28, 50, 80, 3]},
          {name: 'CCC', values: [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
        ],
        xDomain = [],
        yDomain = [],
        // TODO: move it to app.config
        margin={top: 10, right: 50, bottom: 30, left: 50},
        // SVG viewBox dimention (then need to be hardcoded in the template).
        // Note: that it scales and only needs to be edited for the proportions.
        // TODO: move it to app.config
        width = 720, height=400;
      
      $scope.svg = {
        margin: margin,
        width: width,
        height: height,
        inWidth: width - margin.left - margin.right,
        inHeight: height - margin.top - margin.bottom
      };

      // Calculate min, max, median of ranges and set the domains
      for (var i = 0; i < data.length; i++) {
        data[i].values.sort(d3.ascending);
        data[i].min = data[i].values[0];
        data[i].max = data[i].values.slice(-1)[0];
        data[i].median = d3.median(data[i].values);
        
        yDomain.push(data[i].min);
        yDomain.push(data[i].max);
        xDomain.push(data[i].name);
      }
      yDomain.sort(d3.ascending);
      yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

      // Set scales
      $scope.ticks = 6;
      $scope.xScale = d3.scale.ordinal().
        domain(xDomain).
        rangePoints([0, $scope.svg.inWidth], 1);
      $scope.yScale = d3.scale.linear().
        domain(yDomain).
        range([$scope.svg.inHeight, 0]).
        nice();

      // Set data
      $scope.data = {
        title: 'Distribution of some Data',
        desc: 'Those data are random and harcoded.',
        groups: data
      };
    })

  ;

})();
