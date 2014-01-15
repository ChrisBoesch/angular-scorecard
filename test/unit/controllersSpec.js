/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('controllers', function(){
    var ctrl, scope;

    beforeEach(module('myApp.controllers'));

    beforeEach(inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {
        $scope: scope
      });
    }));

    it('should set "who"', function() {
      expect(scope.data.groups[0].min).toBe(10);
      expect(scope.data.groups[0].max).toBe(99);
      expect(scope.data.groups[0].median).toBe(57);
      expect(scope.yScale.ticks(6)).toEqual([0,20,40,60,80,100]);
      expect(scope.yScale(100)).toBe(0);
    });

  });

})();