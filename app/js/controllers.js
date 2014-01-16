(function () {
  'use strict';

  angular.module('myApp.controllers', ['myApp.services', 'myApp.directives', 'angularSpinkit', 'myApp.config']).

    controller('SidebarCtrl', function($scope, dataset) {
      $scope.loading = true;
      $scope.graphs = [];

      dataset.all().then(function(resp) {
        $scope.loading = false;
        $scope.graphs = resp;
      });

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
