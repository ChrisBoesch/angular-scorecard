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

  });

})();