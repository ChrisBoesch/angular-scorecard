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
        },
        $routeParams: {
          key: 1,
          label: 2
        }
      });
    }));

    it('should set et scales helpers', function() {
      expect(lastKey).toBe(1);
      expect(scope.loading).toBe(true);

      getDefer.resolve({title: 'foo'});
      scope.$apply();

      expect(scope.data.title).toEqual('foo');
      expect(scope.loading).toBe(false);
    });

  });

})();