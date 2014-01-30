(function () {
  'use strict';

  angular.module('myApp.controllers', ['myApp.services', 'myApp.directives', 'angularSpinkit', 'myApp.config', 'ui.bootstrap']).

    controller('SidebarCtrl', function($scope, $routeParams, dataset) {
      var label = parseInt($routeParams.label, 10) || 1;

      $scope.loading = true;
      $scope.graphs = [];

      dataset.all().then(function(resp) {
        $scope.loading = false;
        $scope.graphs = resp;
      });

      $scope.prev = function() {
        var prevlabel = label - 1;

        if ($scope.graphs.length === 0) {
          return '#';
        }

        if (prevlabel === 0) {
          prevlabel = $scope.graphs.length;
        }

        return '#/'+ prevlabel +'/' + $scope.graphs[prevlabel -1].key;
      };

      $scope.next = function() {
        var prevlabel = label + 1;

        if ($scope.graphs.length === 0) {
          return '#';
        }

        if (prevlabel > $scope.graphs.length) {
          prevlabel = 1;
        }

        return '#/'+ prevlabel +'/' + $scope.graphs[prevlabel -1].key;
      };
    }).

    controller('HomeCtrl', function ($scope, $routeParams, dataset) {
      var label = parseInt($routeParams.label, 10) || 1,
        key = $routeParams.key || "0";

      $scope.label = label;
      $scope.loading = true;
      dataset.get(key).then(function(resp){
        $scope.data = resp;
        $scope.loading = false;
      });

    })

  ;

})();
