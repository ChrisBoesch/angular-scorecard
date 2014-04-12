(function() {
  'use strict';

  angular.module('myApp.controllers', [
    'myApp.services',
    'myApp.directives',
    'angularSpinkit',
    'myApp.config',
    'ui.bootstrap'
  ]).

  controller('SidebarCtrl', function($scope, $routeParams, dataset) {
    var label = parseInt($routeParams.label, 10) || 1;

    $scope.dataset = dataset;

    dataset.all();

    $scope.prev = function() {
      var prevlabel = label - 1;

      if (!dataset.chartList || dataset.chartList.length === 0) {
        return '#';
      }

      if (prevlabel === 0) {
        prevlabel = dataset.chartList.length;
      }

      return '#/' + prevlabel + '/' + $scope.dataset.chartList[prevlabel - 1].key;
    };

    $scope.next = function() {
      var prevlabel = label + 1;

      if (!dataset.chartList || dataset.chartList.length === 0) {
        return '#';
      }

      if (prevlabel > $scope.dataset.chartList.length) {
        prevlabel = 1;
      }

      return '#/' + prevlabel + '/' + $scope.dataset.chartList[prevlabel - 1].key;
    };
  }).

  controller('HomeCtrl', function($scope, $routeParams, $q, dataset) {
    var label = parseInt($routeParams.label, 10) || 1,
      keyPromise;

    $scope.label = label;
    $scope.loading = true;
    $scope.data = null;

    function getKey(index) {
      return dataset.all().then(function(list) {
        if (list.length > index) {
          return list[index].key;
        } else {
          return $q.reject(new Error("No key found"));
        }
      });
    }

    function getData(key) {
      return dataset.get(key).then(function(resp) {
        $scope.data = resp;
        return resp;
      });
    }

    if ($routeParams.key) {
      keyPromise = $q.when(parseInt($routeParams.key, 10));
    } else {
      keyPromise = getKey(label - 1);
    }

    keyPromise.then(
      getData
    )['finally'](function() {
      $scope.loading = false;
    });
  })

  ;

})();