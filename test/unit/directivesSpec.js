/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('directives', function(){
    var $compile, $rootScope, $httpBackend, svg;

    beforeEach(module('myApp.directives'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, SVG){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      svg = SVG;
    }));

    describe('myChart', function(){
      
      it('should a svg', function() {
        var element;

        element = $compile("<my-chart chart-data=\"data\"><my-chart/>")($rootScope);

        $rootScope.$digest();
        expect(element.html()).toContain('<!-- ngInclude: template -->');

        $rootScope.data = {
          title: 'Distribution of some Data',
          subtitle: 'Those data are random and harcoded.',
          type: 'boxPlot',
          series: [
            {name: 'AA', data: [3,1,10]},
            {name: 'BBB', data: [4,5,6]},
            {name: 'CCC', data: [9,5,1]},
          ]
        };

        $httpBackend.expectGET('/partials/boxplot.html').respond('{{chartData.title}}');
        $rootScope.$digest();

        expect($rootScope.$$childHead.chartData.title).toEqual('Distribution of some Data');
        expect($rootScope.data.series[0].min).toBe(1);
        expect($rootScope.data.series[0].max).toBe(10);
        expect($rootScope.data.series[0].median).toBe(3);
        expect($rootScope.data.yScale.ticks()).toEqual([1,2,3,4,5,6,7,8,9,10]);
        expect($rootScope.data.yScale.invert(0)).toBe(10);
        expect($rootScope.data.yScale.invert(svg.inHeight)).toBe(1);
      });

    });


  });

})();