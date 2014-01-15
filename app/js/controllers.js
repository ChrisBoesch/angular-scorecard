(function () {
  'use strict';

  angular.module('myApp.controllers', ['myApp.services', 'angularSpinkit', 'myApp.config']).

    controller('SidebarCtrl', function($scope, dataset) {
      $scope.loading = true;
      $scope.graphs = [];

      dataset.all().then(function(resp) {
        $scope.loading = false;
        $scope.graphs = resp;
      });

    }).

    controller('HomeCtrl', function ($scope, $window, $routeParams, dataset, SVG, TPL_PATH) {
      var d3 = $window.d3,
        xDomain = [],
        yDomain = [],
        label = parseInt($routeParams.label, 10) || 1,
        key = $routeParams.key || "0";
      
      $scope.svg = SVG;

      function buildScales(graph) {
        var data = graph.series;
        // Calculate min, max, median of ranges and set the domains
        for (var i = 0; i < data.length; i++) {
          data[i].data.sort(d3.ascending);
          data[i].min = data[i].data[0];
          data[i].max = data[i].data.slice(-1)[0];
          data[i].median = d3.median(data[i].data);
          
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
        $scope.template = TPL_PATH + '/boxplot.html';
        $scope.loading = false;
      }

      $scope.label = label;
      $scope.loading = true;
      dataset.get(key).then(buildScales);
    })

  ;

})();
