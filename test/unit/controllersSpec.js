/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('controllers', function(){
    var ctrl, scope, dataset, getDefer, lastKey;

    beforeEach(module('myApp.controllers'));

    describe('HomeCtrl', function() {

      beforeEach(inject(function($controller, $rootScope, $q){
        scope = $rootScope.$new();
        getDefer = $q.defer();
        dataset = {
          get: function(key) {
            lastKey = key;
            return getDefer.promise;
          }
        };

        ctrl = $controller('HomeCtrl', {
          $scope: scope,
          dataset: dataset,
          $routeParams: {
            key: 1,
            label: 2
          }
        });
      }));

      it('should set the chart data', function() {
        expect(lastKey).toBe(1);
        expect(scope.loading).toBe(true);

        getDefer.resolve({title: 'foo'});
        scope.$apply();

        expect(scope.data.title).toEqual('foo');
        expect(scope.loading).toBe(false);
      });

    });

    describe('SidebarCtrl', function() {
      var allDefer;

      beforeEach(inject(function($controller, $rootScope, $q){
        scope = $rootScope.$new();
        allDefer = $q.defer();

        ctrl = $controller('SidebarCtrl', {
          $scope: scope,
          dataset: {
            all: function() {
              return allDefer.promise;
            }
          }
        });
      }));

      it('should set loading', function() {
        expect(scope.loading).toBe(true);

        allDefer.resolve([]);
        scope.$apply();

        expect(scope.loading).toBe(false);
      });

      it('should set the chart list', function() {
        expect(scope.graphs).toEqual([]);

        allDefer.resolve([{'title': 'Some title', 'key': 0}]);
        scope.$apply();

        expect(scope.graphs).toEqual([{'title': 'Some title', 'key': 0}]);
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