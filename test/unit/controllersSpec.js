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
      expect(scope.who).toEqual("World");
    });

  });

})();