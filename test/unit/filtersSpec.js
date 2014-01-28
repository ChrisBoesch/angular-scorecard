/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('filter', function(){
    var filter;

    beforeEach(module('myApp.filters'));

    beforeEach(inject(function($filter) {
      filter = $filter;
    }));

    describe('round', function(){
      it('should round number to chosen precision', function() {
        expect(filter('round')(4/3, 2)).toBe(1.33);
      });

      it('should 0 precision as default', function() {
        expect(filter('round')(4/3)).toBe(1);
      });
    });

    describe('points', function(){
      it('should calculate the point attribute of polyline', function() {
        var xScale = function(v) {
            return v + 2;
          },
          yScale = function(v) {
            return v + 1;
          },
          points = filter('points');

        xScale.domain = function(){
          return [1,2,3];
        };
        
        expect(points([1,2,3], xScale, yScale)).toBe('3,2 4,3 5,4');
      });
    });

  });

})();