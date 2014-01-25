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

    describe('scBNestedAxis', function() {
      beforeEach(inject(function(SVG) {
        $rootScope.svg = SVG({top:10, right:10, bottom:40, left:10}, 120, 150);
        $rootScope.xScale = d3.scale.ordinal().domain(['A','B','C','D']).rangeBands([0, 100], 0, 0);
        $rootScope.xTree = [
          {'root': 'AB', 'children': ['A','B']},
          {'root': 'CD', 'children': ['C','D']}
        ];
      }));

      it('should set the axis line', function() {
        var element = $compile('<g sc-b-nested-axis="xScale" sc-tree="xTree" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.attr('x1')).toBe('-5');
        expect(axis.attr('x2')).toBe('100');
        expect(axis.attr('y1')).toBe('0');
        expect(axis.attr('y2')).toBe('0');
      });

      it('should set the axis ticks', function() {
        var element = $compile('<g sc-b-nested-axis="xScale" sc-tree="xTree" sc-layout="svg"></g>')($rootScope);

        $rootScope.$apply();
        var firstAxis = element.find('.axis-0');
        expect(firstAxis.length).toBe(4);
        expect(firstAxis.get(0).getAttribute('transform')).toBe('translate(0,100)');
        expect(firstAxis.get(1).getAttribute('transform')).toBe('translate(25,100)');
        expect(firstAxis.get(2).getAttribute('transform')).toBe('translate(50,100)');
        expect(firstAxis.get(3).getAttribute('transform')).toBe('translate(75,100)');
        
        var ticks = firstAxis.find('g.tick');
        
        expect(ticks.length).toBe(4);
        expect(ticks.find('text').length).toBe(4);
        expect(ticks.find('line').length).toBe(4);
        ticks.each(function(i){
          var label = $(this).find('text');
          var line = $(this).find('line');

          expect($(this).get(0).getAttribute('transform')).toBe('translate(12.5,0)');
          expect(label.text()).toBe(String.fromCharCode(65+i));
          expect(label.get(0).getAttribute('x')).toBe("0");
          expect(label.get(0).getAttribute('y')).toBe("0");
          expect(label.get(0).getAttribute('dy')).toBe(".5em");

          expect(line.get(0).getAttribute('x1')).toBe("0");
          expect(line.get(0).getAttribute('x2')).toBe("0");
          expect(line.get(0).getAttribute('y1')).toBe("0");
          expect(line.get(0).getAttribute('y2')).toBe("5");
          
        });

        var secondAxis = element.find('.axis-1');
        expect(secondAxis.length).toBe(2);
        expect(secondAxis.find('text').text()).toBe('ABCD');
        expect(secondAxis.find('text').first().text()).toBe('AB');
      });


    });

    describe('scBoxPlot', function() {
      beforeEach(function() {

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

      });

      it('should set svg layout', function() {
        var element;
        element = $compile('<sc-box-plot sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        $rootScope.$apply();
        var svg = element.find('svg');
        expect(svg.length).toBe(1);
        expect(svg.get(0).getAttribute('viewBox')).toEqual('-50 -10 180 140');
      });

      it('should calculate min, max, median on each serie', function() {
        var element;
        element = $compile('<sc-box-plot sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.data.series[0].min).toBe(1);
        expect($rootScope.data.series[0].max).toBe(10);
        expect($rootScope.data.series[0].median).toBe(3);
        expect($rootScope.$$childHead.yScale.ticks()).toEqual([1,2,3,4,5,6,7,8,9,10]);
        expect($rootScope.$$childHead.yScale.invert(0)).toBe(10);
        expect($rootScope.$$childHead.yScale.invert(100)).toBe(1);

        expect(element.find('line.distribution').length).toBe(3);
        expect(element.find('line.min').length).toBe(3);
        expect(element.find('line.max').length).toBe(3);
        expect(element.find('rect.median').length).toBe(3);
        expect(element.find('text.median-label').length).toBe(3);

        // check that the middle serie is in the middle of the chart.
        expect(element.find('g.serie').get(1).getAttribute('transform')).
          toBe('translate(50,0)');

        // TODO: could check for more attribute.

      });

    });

    describe('scGroupedBoxPlot', function(){

      beforeEach(function() {

        $rootScope.data = {
          title: 'Distribution of some Data',
          subtitle: 'Those data are random and harcoded.',
          type: 'groupedBoxPlot',
          series: [
            {
              name: 'AA',
              series: [
                {'name': 'A1', 'data': [1,2,3]},
                {'name': 'A2', 'data': [6,1,4]},
              ]
            },
            {
              name: 'BBB',
              series: [
                {'name': 'B1', 'data': [0,2,10]},
                {'name': 'B2', 'data': [3,2,1]},
              ]
            },
          ]
        };

      });

      it('should set svg layout', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="200" sc-height="180"/>')($rootScope);

        $rootScope.$apply();
        var svg = element.find('svg');
        expect(svg.length).toBe(1);
        expect(svg.get(0).getAttribute('viewBox')).toEqual('-50 -10 200 180');
      });

      it('should calculate min, max, median, mean on each serie', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.data.series[0].series[0].min).toBe(1);
        expect($rootScope.data.series[0].series[0].max).toBe(3);
        expect($rootScope.data.series[0].series[0].median).toBe(2);
        expect($rootScope.data.series[0].series[0].mean).toBe(2);
      });

      it('should set xScale', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.xScale.domain()).toEqual(['A1', 'A2', 'B1', 'B2']);
        expect($rootScope.$$childHead.xScale.rangeBand()).toEqual(25);
        expect($rootScope.$$childHead.xScale('A1')).toEqual(0);
        expect($rootScope.$$childHead.xScale('A2')).toEqual(25);
        expect($rootScope.$$childHead.xScale('B1')).toEqual(50);
        expect($rootScope.$$childHead.xScale('B2')).toEqual(75);
      });

      it('should set legendScale', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.legendScale.domain()).toEqual(['median', 'mean']);
        expect($rootScope.$$childHead.legendScale.rangeBand()).toEqual(20);
        expect($rootScope.$$childHead.legendScale('median')).toEqual(20);
        expect($rootScope.$$childHead.legendScale('mean')).toEqual(60);
      });

      it('should set yScale', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.yScale.domain()).toEqual([0,10]);
        // reversed scale... gives the distance from 0.0 with is the 
        // top left corner of the chart.
        expect($rootScope.$$childHead.yScale(5)).toEqual(50);
        expect($rootScope.$$childHead.yScale(1)).toEqual(90);
        expect($rootScope.$$childHead.yScale(9)).toEqual(10);
      });


      it('should set xTree', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.xTree).toEqual([
          {root: 'AA', children:['A1', 'A2']},
          {root: 'BBB', children:['B1', 'B2']},
        ]);
      });

      it('should draw each serie', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect(element.find('.grouped-serie').length).toBe(2);
        expect(element.find('.serie').length).toBe(4);

        element.find('.serie').each(function(i){
          var x = 25 * i + 12.5;
          expect(this.getAttribute('transform')).toBe('translate('+ x + ',0)');
        });

        expect(element.find('.serie line.distribution').length).toBe(4);
        expect(element.find('.serie line.min').length).toBe(4);
        expect(element.find('.serie line.max').length).toBe(4);
        expect(element.find('.serie rect.median').length).toBe(4);
        expect(element.find('.serie rect.mean').length).toBe(4);
        expect(element.find('.serie text.median-label').length).toBe(4);
      });

      it('should draw the legend', function() {
        var element;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        expect(element.find('.legend g').length).toBe(2);
        element.find('.legend g').each(function(i) {
          var x = 20 * (i+1) + 20 * i;
          expect(this.getAttribute('transform')).toBe('translate('+ x + ',160)');
        });
      });

    });


  });

})();