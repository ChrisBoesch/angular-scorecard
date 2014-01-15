(function () {
  'use strict';

  angular.module('myApp.controllers', ['myApp.services', 'angularSpinkit']).

    controller('HomeCtrl', function ($scope, $window, dataset) {
      var d3 = $window.d3,
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

      function buildScales(graph) {
        var data = graph.groups;
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
        $scope.data = graph;
        $scope.loading = false;
      }

      $scope.loading = true;
      dataset.get(0).then(buildScales);
    })

  ;

})();
