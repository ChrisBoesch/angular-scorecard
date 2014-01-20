/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('directives', function(){
    var $compile, $rootScope, $httpBackend, svg, d3;

    beforeEach(module('myApp.directives'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, SVG, $window){
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      d3 = $window.d3;
      $rootScope.svg = svg = SVG();
    }));

    describe('scViewBox', function(){

      it('should create a svg element with default SVG settings', function() {

        var element = $compile('<svg sc-view-box><text>{{foo}}</text></svg>')($rootScope);
        $rootScope.foo = 'bar';
        $rootScope.$digest();

        expect(element.get(0).getAttribute('viewBox')).toEqual('-70 -10 720 400');
        expect(element.get(0).getAttribute('preserveAspectRatio')).toEqual('xMidYMid meet');
        expect(element.find('text').text()).toBe('bar');

      });

      it('should create a svg element with default SVG settings', function() {

        var element = $compile('<svg sc-view-box="svg"><text>{{foo}}</text></svg>')($rootScope);
        $rootScope.foo = 'bar';
        $rootScope.svg = {margin: {top: 10, left: 20}, width: 200, height: 150};
        $rootScope.$digest();

        expect(element.get(0).getAttribute('viewBox')).toEqual('-20 -10 200 150');
        expect(element.get(0).getAttribute('preserveAspectRatio')).toEqual('xMidYMid meet');
        expect(element.find('text').text()).toBe('bar');

      });

    });

    describe('scRAxis', function() {
      
      beforeEach(inject(function(SVG) {
        $rootScope.svg = SVG({top:10, right:10, bottom:10, left:10}, 120, 120);
        $rootScope.yScale = d3.scale.linear().domain([0,100]).range([100, 0]);
        $rootScope.title = "Something";
      }));

      it('should set the axis line', function() {
        var element = $compile('<g sc-r-axis="yScale" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.attr('x1')).toBe('0');
        expect(axis.attr('x2')).toBe('0');
        expect(axis.attr('y1')).toBe('-5');
        expect(axis.attr('y2')).toBe('105');
        
      });

      it('should set the axis ticks', function() {
        var element = $compile('<g sc-r-axis="yScale" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var ticks = element.find('g.tick');
        expect(ticks.length).toBe(6);
        expect(ticks.get(0).getAttribute('transform')).toBe('translate(0,100)');
        expect(ticks.get(1).getAttribute('transform')).toBe('translate(0,80)');
        expect(ticks.get(2).getAttribute('transform')).toBe('translate(0,60)');
        expect(ticks.get(3).getAttribute('transform')).toBe('translate(0,40)');
        expect(ticks.get(4).getAttribute('transform')).toBe('translate(0,20)');
        expect(ticks.get(5).getAttribute('transform')).toBe('translate(0,0)');
        expect(ticks.find('line').attr('x1')).toBe('-5');
        expect(ticks.find('line').attr('x2')).toBe('0');
        expect(ticks.find('line').attr('y1')).toBe('0');
        expect(ticks.find('line').attr('y2')).toBe('0');
      });

      it('should set the axis rulers', function() {
        var element = $compile('<g sc-r-axis="yScale" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var rulers = element.find('line.ruler');
        expect(rulers.length).toBe(6);
        expect(rulers.get(0).getAttribute('transform')).toBe('translate(0,100)');
        expect(rulers.get(1).getAttribute('transform')).toBe('translate(0,80)');
        expect(rulers.get(2).getAttribute('transform')).toBe('translate(0,60)');
        expect(rulers.get(3).getAttribute('transform')).toBe('translate(0,40)');
        expect(rulers.get(4).getAttribute('transform')).toBe('translate(0,20)');
        expect(rulers.get(5).getAttribute('transform')).toBe('translate(0,0)');
        expect(rulers.attr('x1')).toBe('0');
        expect(rulers.attr('x2')).toBe('100');
        expect(rulers.attr('y1')).toBe('0');
        expect(rulers.attr('y2')).toBe('0');
      });

      it('should set the axis title', function() {
        var element = $compile('<g sc-r-axis="yScale" sc-layout="svg" title="title"></g>')($rootScope);

        $rootScope.$apply();

        var title = element.find('g.title');
        var text = title.find('text');

        expect(title.get(0).getAttribute('transform')).toBe('translate(-10,50)');
        expect(text.get(0).getAttribute('transform')).toBe('rotate(-90)');
        expect(text.text()).toBe('Something');
        
      });
    });

    describe('scBAxis', function() {
      
      beforeEach(inject(function(SVG) {
        $rootScope.svg = SVG({top:10, right:10, bottom:10, left:10}, 120, 120);
        $rootScope.xScale = d3.scale.ordinal().domain(['A','B','C']).rangePoints([0, 100], 0.5);
      }));

      it('should set the axis line', function() {
        var element = $compile('<g sc-b-axis="xScale" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.attr('x1')).toBe('-5');
        expect(axis.attr('x2')).toBe('100');
        expect(axis.attr('y1')).toBe('0');
        expect(axis.attr('y2')).toBe('0');
        
      });

      it('should set the axis ticks', function() {
        var element = $compile('<g sc-b-axis="xScale" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var ticks = element.find('g.tick');
        expect(ticks.length).toBe(3);
        expect(ticks.get(0).getAttribute('transform')).toBe('translate(10, 100)');
        expect(ticks.get(1).getAttribute('transform')).toBe('translate(50, 100)');
        expect(ticks.get(2).getAttribute('transform')).toBe('translate(90, 100)');
        expect(ticks.find('line').attr('x1')).toBe('0');
        expect(ticks.find('line').attr('x2')).toBe('0');
        expect(ticks.find('line').attr('y1')).toBe('0');
        expect(ticks.find('line').attr('y2')).toBe('5');

        var labels = element.find('g.tick text');
        expect(labels.length).toBe(3);
        labels.each(function(i) {
          // expect A,B,C sequence.
          expect($(this).text()).toBe(String.fromCharCode(65+i));
        });
      });

    });

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