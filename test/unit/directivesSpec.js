/*global describe, beforeEach, it, it, inject, expect*/

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

    describe('scRAxis', function() {
      
      beforeEach(inject(function(SVG) {
        $rootScope.svg = SVG({top:10, right:10, bottom:10, left:10}, 120, 120);
        $rootScope.yScale = d3.scale.linear().domain([0,100]).range([100, 0]);
        $rootScope.title = "Something";
      }));

      it('should append svg element', function() {
        var element = $compile('<svg><sc-r-axis sc-scale="yScale" sc-layout="svg"></sc-r-axis></svg>')($rootScope);

        $rootScope.$apply();
        var line = element.find('line.axis');
        expect(line.length).toBe(1);
        expect(line.get(0).namespaceURI).toBe("http://www.w3.org/2000/svg");
        
      });

      it('should set the axis line', function() {
        var element = $compile('<svg><sc-r-axis sc-scale="yScale" sc-layout="svg"></sc-r-axis></svg>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.attr('x1')).toBe('0');
        expect(axis.attr('x2')).toBe('0');
        expect(axis.attr('y1')).toBe('-5');
        expect(axis.attr('y2')).toBe('105');
        
      });

      it('should set the axis ticks', function() {
        var element = $compile('<svg><sc-r-axis sc-scale="yScale" sc-layout="svg"></sc-r-axis></svg>')($rootScope);

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
        var element = $compile('<svg><sc-r-axis sc-scale="yScale" sc-layout="svg"></sc-r-axis></svg>')($rootScope);

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
        var element = $compile('<svg><sc-r-axis sc-scale="yScale" sc-layout="svg" title="title"></sc-r-axis></svg>')($rootScope);

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
        var element = $compile('<svg><sc-b-axis sc-scale="xScale" sc-layout="svg"></sc-b-axis></svg>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.get(0).namespaceURI).toBe("http://www.w3.org/2000/svg");
        expect(axis.attr('x1')).toBe('-5');
        expect(axis.attr('x2')).toBe('100');
        expect(axis.attr('y1')).toBe('0');
        expect(axis.attr('y2')).toBe('0');
        
      });

      it('should set the axis ticks', function() {
        var element = $compile('<svg><sc-b-axis sc-scale="xScale" sc-layout="svg"></sc-b-axis></svg>')($rootScope);

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
        var element = $compile('<svg><sc-b-nested-axis sc-scale="xScale" sc-tree="xTree" sc-layout="svg"></sc-b-nested-axis></svg>')($rootScope);

        $rootScope.$apply();
        var axis = element.find('line.axis');
        expect(axis.length).toBe(1);
        expect(axis.get(0).namespaceURI).toBe("http://www.w3.org/2000/svg");
        expect(axis.attr('x1')).toBe('-5');
        expect(axis.attr('x2')).toBe('100');
        expect(axis.attr('y1')).toBe('0');
        expect(axis.attr('y2')).toBe('0');
      });

      it('should set the axis ticks', function() {
        var element = $compile('<svg><sc-b-nested-axis sc-scale="xScale" sc-tree="xTree" sc-layout="svg"></sc-b-nested-axis></svg>')($rootScope);

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

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-box-plot sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        expect(function(){$rootScope.$apply();}).not.toThrow();
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

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        expect(function(){$rootScope.$apply();}).not.toThrow();
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
        var element, xTree;
        element = $compile('<sc-grouped-box-plot sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);

        $rootScope.$apply();

        xTree = $rootScope.$$childHead.xTree;
        expect(xTree[0].root).toEqual('AA');
        expect(xTree[0].children).toEqual(['A1', 'A2']);
        expect(xTree[1].root).toEqual('BBB');
        expect(xTree[1].children).toEqual(['B1', 'B2']);
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

  
    describe('scBar', function(){
      
      beforeEach(function() {

        $rootScope.data = {
          title: 'Some bars',
          type: 'bar',
          subtitle: 'Random data',
          axisY: {
            name: 'Number',
            min: 0,
          },
          series: [
            {name: 'AA', data:  50},
            {name: 'BBB', data:  100}
          ]
        };

      });

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-bar sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);
  
        expect(function(){$rootScope.$apply();}).not.toThrow();
      });

      it('should set svg layout', function() {
        var element;
        element = $compile('<sc-bar sc-data="data" sc-width="200" sc-height="180"/>')($rootScope);

        $rootScope.$apply();
        var svg = element.find('svg');
        expect(svg.length).toBe(1);
        expect(svg.get(0).getAttribute('viewBox')).toEqual('-70 -10 200 180');
      });

      it('should set xScale', function() {
        var element;
        element = $compile('<sc-bar sc-data="data" sc-width="200" sc-height="140"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.xScale.domain()).toEqual(['AA', 'BBB']);
        expect($rootScope.$$childHead.xScale('AA')).toBe(25);
        expect($rootScope.$$childHead.xScale('BBB')).toBe(75);
      });

      it('should set yScale', function() {
        // TODO: removed harcoded min domain value
        // to let the data set them.
        
        var element;
        element = $compile('<sc-bar sc-data="data" sc-width="200" sc-height="160"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.yScale.domain()).toEqual([0, 120]);
        expect($rootScope.$$childHead.yScale(50)).toEqual(50);
        expect($rootScope.$$childHead.yScale(100)).toEqual(100);
      });

      it('should set yAxisScale', function() {
        // TODO: removed harcoded min domain value
        // to let the data set them.
        
        var element;
        element = $compile('<sc-bar sc-data="data" sc-width="200" sc-height="160"/>')($rootScope);

        $rootScope.$apply();

        expect($rootScope.$$childHead.yAxisScale.domain()).toEqual([0, 120]);
        expect($rootScope.$$childHead.yAxisScale(50)).toEqual(70);
        expect($rootScope.$$childHead.yAxisScale(100)).toEqual(20);
      });

      it('should draw each serie', function() {
        
        var element;
        element = $compile('<sc-bar sc-data="data" sc-width="200" sc-height="160"/>')($rootScope);

        $rootScope.$apply();

        expect(element.find('.serie').length).toBe(2);
        element.find('.serie').each(function(i){
          var x = 25 * (i+1) + 25 * i;
          var y = 120 - $rootScope.data.series[i].data;
          expect(this.getAttribute('transform')).toBe('translate('+ x +',' + y + ')');
        });

        expect(element.find('.serie rect').length).toBe(2);
        element.find('.serie rect').each(function(i){
          expect(this.getAttribute('height')).toBe(''+ $rootScope.data.series[i].data);
        });

        expect(element.find('.serie text').length).toBe(2);
        element.find('.serie').each(function(i){
          expect($(this).text().trim()).toBe(''+ $rootScope.data.series[i].data);
        });
      });

    });
  
    describe('scPie', function(){

      beforeEach(function() {

        $rootScope.data = {
          title: 'Pie title',
          type: 'pie',
          subtitle: 'Pie subtitle',
          series: [
            {name: 'AAA', data:  40},
            {name: 'BBB', data:  100},
            {name: 'CCC', data:  60},
          ]
        };

      });

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-pie sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);
        $rootScope.$apply();
        expect(function(){$rootScope.$apply();}).not.toThrow();
      });

      it('should set the layout', function() {
        var element;
        element = $compile('<sc-pie sc-data="data" sc-width="120" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        expect($rootScope.$$childHead.layout.margin).toEqual(
          {top:10, right:10, bottom:90, left:10}
        );
        expect($rootScope.$$childHead.layout.inHeight).toBe(100);
        expect($rootScope.$$childHead.layout.inWidth).toBe(100);
        expect($rootScope.$$childHead.layout.height).toBe(200);
        expect($rootScope.$$childHead.layout.width).toBe(120);
      });

      it('should set pieRadius equal to inWidth/2', function(){
        var element;
        // chart is higher than wider
        element = $compile('<sc-pie sc-data="data" sc-width="120" sc-height="300"/>')($rootScope);

        $rootScope.$apply();
        expect($rootScope.$$childHead.pieRadius).toBe(50);
        expect($rootScope.$$childHead.legendXAnchor).toBe(0);
      });

      it('should set pieRadius equal to inHeight/2', function(){
        var element;
        // chart is wider than  higher (the inner part for the chart itself).
        element = $compile('<sc-pie sc-data="data" sc-width="170" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        expect($rootScope.$$childHead.pieRadius).toBe(50);
        // the pie will be 100px wide width 25px left on each side.
        expect($rootScope.$$childHead.legendXAnchor).toBe(25);
      });

      it('should set pieData', function() {
        var element, pieData;
        element = $compile('<sc-pie sc-data="data" sc-width="170" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        pieData = $rootScope.$$childHead.pieData;

        function round(v) {
          return Math.round(v*10000) / 10000;
        }

        expect(pieData.length).toBe(3);

        // The series in the pie should be ordered
        expect(pieData[1].value).toBe(100);
        expect(pieData[1].startAngle).toBe(0);
        expect(round(pieData[1].endAngle)).toBe(round(Math.PI));

        expect(pieData[2].value).toBe(60);
        expect(round(pieData[2].startAngle)).toBe(round(Math.PI));
        expect(round(pieData[2].endAngle)).toBe(round(Math.PI*8/5));

        expect(pieData[0].value).toBe(40);
        expect(round(pieData[0].startAngle)).toBe(round(Math.PI*8/5));
        expect(round(pieData[0].endAngle)).toBe(round(Math.PI*2));
      });

      it('should set color scale', function() {
        var element, scale;
        element = $compile('<sc-pie sc-data="data" sc-width="170" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        scale = $rootScope.$$childHead.colors;

        expect(scale('foo')).toBe(scale('foo'));
        expect(scale('foo')).not.toBe(scale('bar'));

        // checks it returns an hexadecimal color.
        expect(scale('foo')[0]).toBe('#');
        expect(angular.isNumber(parseInt(scale('foo').slice(1), 16))).toBe(true);
      });

      it('should it sets the percentage formatter', function() {
        var element, p;
        element = $compile('<sc-pie sc-data="data" sc-width="170" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        p = $rootScope.$$childHead.percentage;
        expect(p(100)).toBe('50.0%');
        expect(p(40)).toBe('20.0%');
        expect(p(60)).toBe('30.0%');
      });

      // skipped
      // TODO: fix it
      xit('should set arc path maker', function() {
        var element, arc, pieData;
        element = $compile('<sc-pie sc-data="data" sc-width="170" sc-height="200"/>')($rootScope);

        $rootScope.$apply();
        pieData = $rootScope.$$childHead.pieData;
        arc = $rootScope.$$childHead.arc;

        // TODO: the x values are not exactly zero somehow.
        // either learn what they should or parse the path and round it
        expect(arc(pieData[1])).toBe('M0,-50A50,50 0 1,1 0,50L0,0Z');
      });

      it('should draw the pie', function() {
        var element;
        element = $compile('<sc-pie sc-data="data" sc-width="120" sc-height="200"/>')($rootScope);

        $rootScope.$apply();

        expect(element.find('.pie').get(0).getAttribute('transform')).toBe('translate(50,50)');

        expect(element.find('.pie .slice path').length).toBe(3);
        expect(element.find('.pie .slice text').length).toBe(3);
      });

      it('should draw the legend', function() {
        var element;
        element = $compile('<sc-pie sc-data="data" sc-width="120" sc-height="200"/>')($rootScope);

        $rootScope.$apply();

        expect(element.find('.legend').length).toBe(3);

        expect(element.find('.legend rect').length).toBe(3);
        expect(element.find('.legend text').length).toBe(3);

        // todo: check slice and legend colors match
      });
    });

    describe('scGroupedBar', function(){
      
      beforeEach(function() {

        $rootScope.data =   {
          title: 'Some Title',
          subtitle: 'some subtitle',
          type: 'groupedBar',
          axisY: {
            name: 'Percentage (%)',
            categories: ['c1', 'c2']
          },
          series: [
            {name: 'AAAA', data: [100, 50]},
            {name: 'BBBB', data: [100, null]},
          ]
        };

      });

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-grouped-bar sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        expect(function(){$rootScope.$apply();}).not.toThrow();
      });

      it('should set layout', function() {
        var element;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="250" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        expect($rootScope.$$childHead.layout.margin).toEqual(
          { top: 30, right: 30, bottom: 60, left: 70 }
        );
        expect($rootScope.$$childHead.layout.inHeight).toBe(100);
        expect($rootScope.$$childHead.layout.inWidth).toBe(150);
        expect($rootScope.$$childHead.layout.height).toBe(190);
        expect($rootScope.$$childHead.layout.width).toBe(250);
      });

      it('should set xScale', function() {
        var element, xScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        xScale = $rootScope.$$childHead.xScale;
        expect(xScale).toBeTruthy();
        expect(xScale.domain()).toEqual(['AAAA', 'BBBB']);
        expect(xScale('AAAA')).toBe(0);
        expect(xScale('BBBB')).toBe(50);
        expect(xScale.rangeBand()).toBe(50);
      });

      it('should set xAxisScale', function() {
        var element, xAxisScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        xAxisScale = $rootScope.$$childHead.xAxisScale;
        expect(xAxisScale).toBeTruthy();
        expect(xAxisScale.domain()).toEqual(['AAAA', 'BBBB']);
        expect(xAxisScale('AAAA')).toBe(25);
        expect(xAxisScale('BBBB')).toBe(75);
      });

      it('should set xNestedScale', function() {
        var element, xNestedScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="220" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        xNestedScale = $rootScope.$$childHead.xNestedScale;
        expect(xNestedScale).toBeTruthy();
        expect(xNestedScale.domain()).toEqual(['c1', 'c2']);
        
        // inWidth == 120, used by 2 groups; so 60px will be the extend of that scale
        // we expect 1/2 rangeBand on each outer side of the scale
        expect(xNestedScale.rangeBand()).toBe(20);
        expect(xNestedScale('c1')).toBe(10);
        expect(xNestedScale('c2')).toBe(30);
      });

      it('should set colors', function() {
        var element, colors;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="220" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        colors = $rootScope.$$childHead.colors;
        expect(colors).toBeTruthy();
        expect(colors('foo')).toBe(colors('foo'));
        expect(colors('foo')).not.toBe(colors('bar'));

        // checks it returns an hexadecimal color.
        expect(colors('foo')[0]).toBe('#');
        expect(angular.isNumber(parseInt(colors('foo').slice(1), 16))).toBe(true);
      });

      it('should set legendScale', function() {
        var element, legendScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="190"/>')($rootScope);

        $rootScope.$apply();
        legendScale = $rootScope.$$childHead.legendScale;
        expect(legendScale).toBeTruthy();
        expect(legendScale.domain()).toEqual(['c1', 'c2']);
        // we expect 1/2 band margin on the side of each band,
        // and 1/2 band margin on each ends of the scale;
        // so the range band is equal to inner width of the chart divided
        // by 5 (domain.length * (1 + 2*0.5) + 2*0.5)
        expect(legendScale.rangeBand()).toBe(20);
        expect(legendScale('c1')).toBe(20);
        expect(legendScale('c2')).toBe(60);
      });

      it('should set yScale', function() {
        var element, yScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="290"/>')($rootScope);

        $rootScope.$apply();
        yScale = $rootScope.$$childHead.yScale;
        expect(yScale).toBeTruthy();
        expect(yScale.domain()).toEqual([0,100]);
        expect(yScale.range()).toEqual([0,200]);
        expect(yScale(0)).toBe(0);
        expect(yScale(50)).toBe(100);
        expect(yScale(100)).toBe(200);
      });

      it('should set yAxisScale', function() {
        var element, yAxisScale;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="290"/>')($rootScope);

        $rootScope.$apply();
        yAxisScale = $rootScope.$$childHead.yAxisScale;
        expect(yAxisScale).toBeTruthy();
        expect(yAxisScale.domain()).toEqual([0,100]);
        expect(yAxisScale.range()).toEqual([200,0]);
        expect(yAxisScale(0)).toBe(200);
        expect(yAxisScale(50)).toBe(100);
        expect(yAxisScale(100)).toBe(0);
      });

      it('should draw the bars', function() {
        var element;
        element = $compile('<sc-grouped-bar sc-data="data" sc-width="200" sc-height="290"/>')($rootScope);

        $rootScope.$apply();
        expect(element.find('.serie').length).toBe(2);
        expect(element.find('.serie:first .group').length).toBe(2);
        // the 2nd serie is missing a 'c2' serie.
        expect(element.find('.serie:last .group').length).toBe(1);
        expect(element.find('.serie .group rect').length).toBe(3);
        expect(element.find('.serie .group text').length).toBe(3);
      });

    });

    describe('scCombined', function() {
      beforeEach(function() {

        $rootScope.data = {
          title: 'Some Title',
          type: 'combined',
          series: [
            {
              type: 'bar',
              subtitle: 'The Bar Chart Header',
              axisY: {
                name: 'Number',
                min: 0,
              },
              series: [
                {name: 'AAAAAA', data:  180},
                {name: 'BBBBBBB', data:  110}
              ]
            },
            {
              type: 'pie',
              subtitle: 'The Pie Chart Header',
              series: [
                {name: 'AAAAAA', data:  40},
                {name: 'BBBBBB', data:  110},
                {name: 'CCCCCCCCCC', data:  30},
                {name: 'DDDDDDDDDDDD', data:  3}
              ]
            }
          ]
        };

      });

      it('should not raise an error if wrong type', function() {
        $rootScope.data = {};
        $compile('<sc-combined sc-data="data" sc-width="180" sc-height="140"/>')($rootScope);

        expect(function(){$rootScope.$apply();}).not.toThrow();
      });

      it('should set layout', function() {
        var element, layout;
        element = $compile('<sc-combined sc-data="data" sc-width="100" sc-height="100"/>')($rootScope);

        $rootScope.$apply();
        layout = $rootScope.$$childHead.layout;

        expect(layout.margin).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
        expect(layout.inHeight).toBe(100);
        expect(layout.inWidth).toBe(100);
        expect(layout.height).toBe(100);
        expect(layout.width).toBe(100);
      });

      it('should draw a bar and a pie chart', function() {
        var element;
        element = $compile('<sc-combined sc-data="data" sc-width="100" sc-height="100"/>')($rootScope);

        $rootScope.$apply();
        expect(element.find('sc-bar').length).toBe(1);
        expect(element.find('sc-pie').length).toBe(1);

        expect(element.find('sc-bar svg').get(0).viewBox.baseVal.width).toBe(50);
        expect(element.find('sc-pie svg').get(0).viewBox.baseVal.width).toBe(50);
      });

    });
    
    describe('scStackedBar', function(){

      beforeEach(function() {

        $rootScope.data = {
          title: 'Some Stacked bars',
          type: 'stackedBar',
          subtitle: 'some subtitle',
          axisY: {
            name:'Percentage (%)',
            min: 0,
            max: 100,
          },
          axisX: {
            categories: ['AAAA', 'BBBB']
          },
          series: [
            {
              'type': 'bar',
              'name': 'color1',
              'data': ['98', '95']
            },
            {
              'type': 'bar',
              'name': 'color2',
              'data': ['2', '4']
            },
            {
              'type': 'line',
              'name': 'target',
              'data': ['90', '90']
            },
          ]
        };

      });

      it('should set layout', function() {
        var element, layout;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        layout = $rootScope.$$childHead.layout;

        expect(layout.margin).toEqual({ top: 10, right: 10, bottom: 70, left: 70});
        expect(layout.inWidth).toBe(100);
        expect(layout.inHeight).toBe(200);
        expect(layout.width).toBe(180);
        expect(layout.height).toBe(280);

      });

      it('should set stacks', function() {
        var element, stacks;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        stacks = $rootScope.$$childHead.stacks;

        expect(stacks.length).toBe(2);
        expect(stacks[0].length).toBe(2);
        // one stack (one bar) has each component in reverse order.
        // SVG doesn't support layer, so elements in the background need
        // to be created first, in that case the biggest rectangle
        expect(stacks[0][0].name).toBe('color2');
        expect(stacks[0][0].value).toBe(2);
        expect(stacks[0][0].stackValue).toBe(100); // total size of that component, its value + the offset.
        expect(stacks[0][1].name).toBe('color1');
        expect(stacks[0][1].value).toBe(98);
        expect(stacks[0][1].stackValue).toBe(98);

        expect(stacks.componentNames).toEqual(['color1', 'color2']);
      });

      it('should set lines', function() {
        var element, lines;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        lines = $rootScope.$$childHead.lines;

        expect(lines.length).toBe(1);
        expect(lines[0].name).toBe('target');
        expect(lines[0].data).toEqual(['90', '90']);
      });

      it('should set xScale', function() {
        var element, xScale;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        xScale = $rootScope.$$childHead.xScale;

        expect(xScale.domain()).toEqual(['AAAA', 'BBBB']);
        expect(xScale('AAAA')).toBe(25);
        expect(xScale('BBBB')).toBe(75);
      });

      it('should set yScale', function() {
        var element, yScale;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        yScale = $rootScope.$$childHead.yScale;

        expect(yScale.domain()).toEqual([0,100]);
        expect(yScale(0)).toEqual(0);
        expect(yScale(100)).toEqual(200);
        
      });

      it('should calculate yScale min/max', function() {
        var element, yScale;

        $rootScope.data.axisY = {};
        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        yScale = $rootScope.$$childHead.yScale;

        expect(yScale.domain()).toEqual([95,100]);
      });

      it('should set yAxisScale', function() {
        var element, yAxisScale;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        yAxisScale = $rootScope.$$childHead.yAxisScale;

        expect(yAxisScale.domain()).toEqual([0,100]);
        expect(yAxisScale(0)).toEqual(200);
        expect(yAxisScale(100)).toEqual(0);
        
      });

      it('should set colors', function() {
        var element, colors;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        colors = $rootScope.$$childHead.colors;

        expect(colors).toBeTruthy();
        expect(colors('foo')).toBe(colors('foo'));
        expect(colors('foo')).not.toBe(colors('bar'));

        // checks it returns an hexadecimal color.
        expect(colors('foo')[0]).toBe('#');
        expect(angular.isNumber(parseInt(colors('foo').slice(1), 16))).toBe(true);
        
      });

      it('should set legendScale', function() {
        var element, legendScale;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="220" sc-height="280"/>')($rootScope);
        $rootScope.$apply();

        legendScale = $rootScope.$$childHead.legendScale;

        expect(legendScale.domain()).toEqual(['color1', 'color2', 'target']);
        expect(legendScale('color1')).toBe(20);
        expect(legendScale('color2')).toBe(60);
        expect(legendScale('target')).toBe(100);
      });

      it('should draw the stacks', function() {
        var element, stacks;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="220" sc-height="180"/>')($rootScope);
        $rootScope.$apply();

        stacks = element.find('.stack rect');
        expect(stacks.length).toBe(4);

        // check position of the rects (first 2 rect) forming the 1st column
        expect(stacks.get(0).getAttribute('height')).toBe('100');
        expect(stacks.get(0).getAttribute('y')).toBe('0');
        expect(stacks.get(1).getAttribute('height')).toBe('98');
        expect(stacks.get(1).getAttribute('y')).toBe('2');
      });

      it('should draw the lines', function() {
        var element, lines;

        element = $compile('<sc-stacked-bar sc-data="data" sc-width="180" sc-height="180"/>')($rootScope);
        $rootScope.$apply();

        lines = element.find('polyline.line');
        expect(lines.length).toBe(1);
        expect(lines.get(0).getAttribute('points')).toBe('25,10 75,10');
      });

    });

  });

})();