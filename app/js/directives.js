(function () {
  'use strict';

  angular.module('myApp.directives', ['myApp.config']).

    /**
     * Directive to set the a `svga element `viewBox` attribute
     * from values from the scope.
     *
     * With:
     *  
     *  <svg ng-attr-viewBox="0 0 {{100}} {{100}}"/>
     *
     * Angular would produce the correct attribute but it would have no effect. 
     * This directive edit the viewBox.baseVal property directly.
     *
     * Usage:
     *
     *  <svg sc-view-box="layout"/>
     *
     * where `$scope.layout == {width: 100, height: 100, margin:{top:10, left:20}}`
     * 
     */
    directive('scViewBox', function(SVG){
      return {
        scope: {
          'viewBox': '=?scViewBox'
        },
        link: function(scope, element) {
          
          element.get(0).setAttribute('preserveAspectRatio', 'xMidYMid meet');

          scope.$watch('viewBox', function(){
            var vb = scope.viewBox || SVG();

            element.get(0).setAttribute(
              'viewBox',
              [-vb.margin.left, -vb.margin.top, vb.width, vb.height].join(' ')
            );

          });
        }
      };
    }).

    /**
     * Build a axis on the right of a chart.
     *
     * Draw the axis, the axis label, the ticks and the thicks labels.
     *
     * ex:
     * 
     *  <g sc-r-axis="yScale" sc-layout="svg" title="chartName"></g>
     *
     * Where yScale would be a quantity d3 quantitative scale.
     * 
     */
    directive('scRAxis', function($window) {
      return {
        template: '<line class="ruler" ng-repeat="tick in scale.ticks(6)" x1="0" ng-attr-x2="{{layout.inWidth}}" y1="0" y2="0" ng-attr-transform="translate(0,{{scale(tick)}})"/>\n'+
          '<g class="tick" ng-repeat="tick in scale.ticks(6)" ng-attr-transform="translate(0,{{scale(tick)}})">\n'+
          ' <line x1="-5" x2="0" y1="0" y2="0"/>\n'+
          ' <text dx="-6">{{tick}}</text>\n'+
          '</g>\n'+
          '<g class="title" ng-attr-transform="translate({{-layout.margin.left}},{{layout.inHeight/2}})">\n'+
          ' <text transform="rotate(-90)" ng-attr-textLength="{{layout.inHeight}}" lengthAdjust="spacingAndGlyphs">{{title()}}</text>\n'+
          '</g>'+
          '<line class="axis" x1="0" x2="0" y1="-5" ng-attr-y2={{layout.inHeight+5}}/>\n',
        scope: {
          scale: '=scRAxis',
          layout: '=scLayout',
          title: '&?'
        },
        link: function(_, el) {
          var svgEl = $window.d3.select(el.get(0));
          svgEl.classed('axis', true);
          svgEl.classed('y-axis', true);
        }
      };
    }).

    /**
     * Build the bottom axis
     *
     * ex:
     * 
     *  <g sc-b-axis="xScale" sc-layout="svg"></g>
     *
     * Where xScale would be a quantity d3 ordinal scale.
     * 
     */
    directive('scBAxis', function($window) {
      return {
        template: ' <g class="tick" ng-repeat="name in scale.domain()" transform="translate({{scale(name)}}, {{layout.inHeight}})">'+
          '  <line x1="0" x2="0" y1="0" y2="5"/>\n'+
          '  <text dy=".5em">{{name}}</text>\n'+
          ' </g>'+
          '<line class="axis" ng-attr-transform="translate(0, {{layout.inHeight}})" x1="-5" y1="0" y2="0" ng-attr-x2={{layout.inWidth}}/>\n',
        scope: {
          scale: '=scBAxis',
          layout: '=scLayout'
        },
        link: function(s, el){
          var svgEl = $window.d3.select(el.get(0));
          svgEl.classed('axis', true);
          svgEl.classed('x-axis', true);
        }
      };
    }).

    directive('scBNestedAxis', function($window){
      return {
        template: '<g class="axis-0" ng-repeat="name in scale.domain()" ng-attr-transform="translate({{scale(name)}},{{layout.inHeight}})">\n'+
          '  <g class="tick" ng-attr-transform="translate({{scale.rangeBand()/2}},0)">\n'+
          '    <line x1="0" x2="0" y1="0" y2="5"/>\n'+
          '    <text x="0" y="0" dy=".5em">{{name}}</text>\n'+
          '  </g>\n'+
          '  <line class="sep" x1="0" y1="0" x2="0" y2="1.8em"/>\n'+
          '</g>'+
          '<g class="axis-1" ng-repeat="leaf in tree" ng-attr-transform="translate({{treeScale($index)}},{{layout.inHeight}})">'+
          '  <line class="sep" x1="0" y1="1.8em" x2="0" y2="3.3em"/>\n'+
          '  <text class="tick" ng-attr-x="{{treeScale.rangeBand($index)/2}}" y="0" dy="1.8em">{{leaf.root}}</text>\n'+
          '</g>'+
          '<line class="sep" x1="0" y1="0" x2="0" y2="3.3em" ng-attr-transform="translate({{layout.inWidth}},{{layout.inHeight}})"/>\n'+
          '<line class="axis" ng-attr-transform="translate(0, {{layout.inHeight}})" x1="-5" y1="0" y2="0" ng-attr-x2={{layout.inWidth}}/>\n',
        scope: {
          scale: '=scBNestedAxis',
          tree: '=scTree',
          layout: '=scLayout'
        },
        link: function(s, el){
          var svgEl = $window.d3.select(el.get(0));
          svgEl.classed('axis', true);
          svgEl.classed('x-axis', true);
          svgEl.classed('nested-axis', true);

          s.treeScale = function(index) {
            var c = 0;
            
            if (index === 0) {
              return 0;
            }

            for (var i = 1; i <= index; i++) {
              c += s.tree[index - i].children.length;
            }
            
            return s.scale.rangeBand() * c;
          };

          s.treeScale.rangeBand = function(index) {
            return s.scale.rangeBand() * s.tree[index].children.length;
          };
        }
      };
    }).
    

    /**
     * Draw a chart
     *
     * usage:
     *
     *  <my-chart chart-data="data" [svg-width="100"] [svg-height="100"]/>
     *  
     */
    directive('myChart', function(TPL_PATH, SVG, SVG_MARGIN, SVG_HEIGHT, SVG_WIDTH, $window) {
      var templates = {
        'boxPlot': TPL_PATH + '/boxplot.html',
        'groupedBoxPlot': TPL_PATH + '/groupedboxplot.html',
        'combined': TPL_PATH + '/combined.html',
        'bar': TPL_PATH + '/bar.html',
        'groupedBar': TPL_PATH + '/groupedbar.html',
        'pie': TPL_PATH + '/pie.html',
        'default': TPL_PATH + '/not-supported.html'
      }, factories = {

        'boxPlot': function buildScales(chart, width, height) {
          var d3 = $window.d3,
            xDomain = [],
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG({top: 10, right: 30, bottom: 30, left: 50}, width, height);

          // Calculate min, max, median of ranges and set the domains
          for (var i = 0; i < data.length; i++) {
            data[i].data.sort(d3.ascending);
            data[i].min = data[i].data[0];
            data[i].max = data[i].data.slice(-1)[0];
            data[i].median = d3.median(data[i].data);
            
            yDomain.push(data[i].min);
            yDomain.push(data[i].max);
            xDomain.push(data[i].name);
          }
          yDomain.sort(d3.ascending);
          yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

          // Set scales
          chart.xScale = d3.scale.ordinal().
            domain(xDomain).
            rangePoints([0, chart.svg.inWidth], 1);
          chart.yScale = d3.scale.linear().
            domain(yDomain).
            range([chart.svg.inHeight, 0]).
            nice();
        },

        'groupedBoxPlot': function(chart, width, height) {
          var d3 = $window.d3,
            leaf,
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG({
            top: SVG_MARGIN.top,
            right: SVG_MARGIN.right,
            bottom: SVG_MARGIN.bottom + 40,
            left: SVG_MARGIN.left
          }, width, height);

          chart.xScale = d3.scale.ordinal();
          chart.yScale = d3.scale.linear();
          chart.xTree = [];
          
          // Calculate min, max, median of ranges and set the domains
          for (var i = 0; i < data.length; i++) {
            leaf = {'root': data[i].name, 'children': []};
            for (var j = 0; j < data[i].series.length; j++) {
              data[i].series[j].data.sort(d3.ascending);
              data[i].series[j].min = data[i].series[j].data[0];
              data[i].series[j].max = data[i].series[j].data.slice(-1)[0];
              data[i].series[j].median = d3.median(data[i].series[j].data);
              data[i].series[j].mean = d3.mean(data[i].series[j].data);

              yDomain.push(data[i].series[j].min);
              yDomain.push(data[i].series[j].max);
              chart.xScale(data[i].series[j].name);
              leaf.children.push(data[i].series[j].name);
            }
            chart.xTree.push(leaf);
          }

          yDomain.sort(d3.ascending);
          yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

          // Set scales
          chart.xScale = chart.xScale.rangeBands([0, chart.svg.inWidth], 0, 0);
          chart.yScale = chart.yScale.domain(yDomain).
            range([chart.svg.inHeight, 0]).
            nice();
        },

        'bar': function(chart, width, height) {
          var d3 = $window.d3,
            xDomain = [],
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG(SVG_MARGIN, width, height);

          // Calculate min, max, median of ranges and set the domains
          for (var i = 0; i < data.length; i++) {
            yDomain.push(data[i].data);
            xDomain.push(data[i].name);
          }
          yDomain.sort(d3.ascending);
          // TODO: Fix  hardcoded Domain low
          yDomain = [0].concat(yDomain.slice(-1));
          yDomain[1] *= 1.1;

          // Set scales
          chart.xScale = d3.scale.ordinal().
            domain(xDomain).
            rangePoints([0, chart.svg.inWidth], 1);
          chart.yScale = d3.scale.linear().
            domain(yDomain).
            range([0, chart.svg.inHeight]).
            nice();
          chart.yScaleReversed = d3.scale.linear().
            domain(yDomain).
            range([chart.svg.inHeight, 0]).
            nice();
        },

        'groupedBar': function(chart, width, height) {
          var d3 = $window.d3,
            xNestedDomain = [],
            xNestedDomainPseudoSet = {},
            xDomain = [],
            yDomain = [],
            entries,
            data = chart.series;
          
          chart.svg=SVG({
            top: 30,
            right: 30,
            bottom: 60,
            left: 70
          }, width, height);

          // Calculate min, max, median of ranges and set the domains
          for (var i = 0; i < data.length; i++) {
            xDomain.push(data[i].name);
            entries = d3.entries(data[i].data);
            for (var j = 0; j < entries.length; j++) {
              yDomain.push(entries[j].value);
              xNestedDomainPseudoSet[entries[j].key] = 1;
            }
          }
          yDomain.sort(d3.ascending);
          // TODO: Fix  hardcoded Domain low
          yDomain = [0].concat(yDomain.slice(-1));
          xNestedDomain = d3.keys(xNestedDomainPseudoSet);

          // Set scales
          chart.xScale = d3.scale.ordinal().
            domain(xDomain).
            rangeBands([0, chart.svg.inWidth], 0, 0);
          chart.xNestedScale = d3.scale.ordinal().
            domain(xNestedDomain).
            rangeBands([0, chart.svg.inWidth/data.length], 0, 0.5);
          chart.colors = d3.scale.category20();
          chart.legendScale = d3.scale.ordinal().
            domain(xNestedDomain).
            rangeBands([0, chart.svg.inWidth], 0.5, 0.5);
          chart.yScale = d3.scale.linear().
            domain(yDomain).
            range([0, chart.svg.inHeight]).
            nice();
          chart.yScaleReversed = d3.scale.linear().
            domain(yDomain).
            range([chart.svg.inHeight, 0]).
            nice();
        },

        'pie': function(chart, width, height) {
          // TODO: check number of item in serie (<20)
          var d3 = $window.d3,
            percentage = d3.scale.linear().
              domain([0, d3.sum(chart.series, function(d){ return d.data; })]).
              range([0,1]),
            formatter = d3.format(".01%");

          chart.svg=SVG(
            {
              top: 10,
              right: 10,
              bottom: 30 + (20 * chart.series.length),
              left: 10
            },
            width,
            height
          );

          // Make sure the pie fits into the inner svg document,
          // and sure the legend aligns with the pie
          if (chart.svg.inHeight > chart.svg.inWidth) {
            chart.pieRadius = chart.svg.inWidth/2;
            chart.legendXAnchor = chart.svg.margin.left;
          } else {
            chart.pieRadius = chart.svg.inHeight/2;
            chart.legendXAnchor = (chart.svg.width - chart.pieRadius*2)/2;
          }
          chart.pieData = d3.layout.pie().
            value(function(d){return d.data;})(chart.series);
          chart.colors = d3.scale.category20();
          chart.percentage = function(d){
            var p = percentage(d);
            return formatter(p);
          };
          chart.labelAnchor = function(s) {
            if (((s.startAngle + s.endAngle) / 2) < Math.PI) {
              return "start";
            } else {
              return "end";
            }
          };
          chart.arc = d3.svg.arc()
            .startAngle(function(d){ return d.startAngle; })
            .endAngle(function(d){ return d.endAngle; })
            .innerRadius(0)
            .outerRadius(chart.pieRadius);
        },


        'combined': function(chart, width, height) {
          chart.svg=SVG(SVG_MARGIN, width, height);
        }

      };

      return {
        restrict: 'E',
        scope: {
          'chartData': '=',
          'svgWidth': '&',
          'svgHeight': '&'
        },
        template: '<div class="graph" ng-include="template"></div>',
        link: function(scope){

          scope.$watch('chartData', function(){
            var gType,
              height = scope.svgHeight() || SVG_HEIGHT,
              width = scope.svgWidth() || SVG_WIDTH;

            if (!scope.chartData) {
              return;
            }

            gType = scope.chartData.type;
            scope.template = templates[gType] ? templates[gType] : templates['default'];
            
            if (factories[gType]) {
              factories[gType](scope.chartData, width, height);
            }

          });
        }
      };
    });

})();
