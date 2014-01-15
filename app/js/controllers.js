(function () {
  'use strict';

  angular.module('myApp.controllers', ['myApp.services', 'angularSpinkit', 'myApp.config']).

    controller('HomeCtrl', function ($scope, $window, dataset, SVG) {
      var d3 = $window.d3,
        xDomain = [],
        yDomain = [];
      
      $scope.svg = SVG;

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
