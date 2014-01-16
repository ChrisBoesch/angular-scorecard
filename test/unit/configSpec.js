/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('config', function(){

    beforeEach(module('myApp.config'));

    it('should calculate the inner width and height of the graph', inject(function(SVG) {
      expect(SVG().inWidth).toBe(620);
      expect(SVG().inHeight).toBe(360);
    }));

  });

})();