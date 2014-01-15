/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('controllers', function(){
    var ctrl, scope, getDefer, lastKey;

    beforeEach(module('myApp.controllers'));

    beforeEach(inject(function($controller, $rootScope, $q){
      scope = $rootScope.$new();
      getDefer = $q.defer();

      ctrl = $controller('HomeCtrl', {
        $scope: scope,
        dataset: {
          get: function(key) {
            lastKey = key;
            return getDefer.promise;
          }
        }
      });
    }));

    it('should set et scales helpers', function() {
      expect(lastKey).toBe('0');

      getDefer.resolve(  {
        title: 'Distribution of some Data',
        subtitle: 'Those data are random and harcoded.',
        type: 'plote',
        series: [
          {name: 'AA', data: [3,1,10]},
          {name: 'BBB', data: [4,5,6]},
          {name: 'CCC', data: [9,5,1]},
        ]
      });
      scope.$apply();

      expect(scope.data.series[0].min).toBe(1);
      expect(scope.data.series[0].max).toBe(10);
      expect(scope.data.series[0].median).toBe(3);
      expect(scope.yScale.ticks()).toEqual([1,2,3,4,5,6,7,8,9,10]);
      expect(scope.yScale.invert(0)).toBe(10);
      expect(scope.yScale.invert(360)).toBe(1);
    });

  });

})();