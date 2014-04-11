/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('controllers', function(){
    var ctrl, scope, dataset, getDefer, lastKey, allDefer;

    beforeEach(module('myApp.controllers'));

    beforeEach(inject(function($q) {
      getDefer = $q.defer();
      allDefer = $q.defer();
      
      dataset = {
        chartList: null,
        loading: null,

        all: function() {
          if (dataset.loading) {
            return dataset.loading;
          }

          dataset.loading = allDefer.promise.then(function(list){
            dataset.chartList = list;
            return list;
          })['finally'](function(){
            dataset.loading = null;
          });

          return dataset.loading;
        },

        get: function(key) {
            lastKey = key;
            return getDefer.promise;
          }
      };
    }));

    describe('HomeCtrl', function() {
      var $controller;

      beforeEach(inject(function(_$controller_, $rootScope){
        scope = $rootScope.$new();
        $controller = _$controller_;
      }));

      it('should set the chart data', function() {
        ctrl = $controller('HomeCtrl', {
          $scope: scope,
          dataset: dataset,
          $routeParams: {
            key: 1,
            label: 2
          }
        });

        scope.$digest();
        expect(lastKey).toBe(1);
        expect(scope.loading).toBe(true);

        getDefer.resolve({title: 'foo'});
        scope.$apply();

        expect(scope.data.title).toEqual('foo');
        expect(scope.loading).toBe(false);
      });

      it('should set the chart data to the 1st chart in the list', function() {
        ctrl = $controller('HomeCtrl', {
          $scope: scope,
          dataset: dataset,
          $routeParams: {}
        });

        allDefer.resolve([
          {'title': 'Some title', 'key': 0},
          {'title': 'Some title', 'key': 1},
          {'title': 'Some title', 'key': 2},
        ]);
        scope.$digest();

        expect(lastKey).toBe(0);
        expect(scope.loading).toBe(true);

        getDefer.resolve({title: 'foo'});
        scope.$apply();

        expect(scope.data.title).toEqual('foo');
        expect(scope.loading).toBe(false);
      });

    });

    describe('SidebarCtrl', function() {

      beforeEach(inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        ctrl = $controller('SidebarCtrl', {
          $scope: scope,
          dataset: dataset
        });
      }));

      it('should set loading', function() {
        expect(scope.dataset.loading).toBeTruthy();

        allDefer.resolve([]);
        scope.$apply();

        expect(scope.dataset.loading).not.toBeTruthy();
      });

      it('should set the chart list', function() {
        expect(scope.dataset.chartList).toBe(null);

        allDefer.resolve([{'title': 'Some title', 'key': 0}]);
        scope.$apply();

        expect(scope.dataset.chartList).toEqual([{'title': 'Some title', 'key': 0}]);
      });

      it('should calculate next chart url', function() {
        expect(scope.next()).toBe('#');

        allDefer.resolve([
          {'title': 'Some title', 'key': 0},
          {'title': 'Some title', 'key': 1},
          {'title': 'Some title', 'key': 2},
        ]);

        scope.$apply();
        expect(scope.next()).toBe('#/2/1');
      });

      it('should calculate previous chart url', function() {
        expect(scope.prev()).toBe('#');

        allDefer.resolve([
          {'title': 'Some title', 'key': 0},
          {'title': 'Some title', 'key': 1},
          {'title': 'Some title', 'key': 2},
        ]);

        scope.$apply();
        expect(scope.prev()).toBe('#/3/2');
      });

    });

  });

})();