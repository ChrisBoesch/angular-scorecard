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
     * This directive edit the viewBox.baseVal proporty directly.
     *
     * Usage:
     *
     *  <svg my-view-box="someScopeProperty"/>
     *
     * where `$scope.someScopeProperty == {width: 100, height: 100}`
     *
     * TODO: write test.
     * 
     */
    directive('myViewBox', function(){
      return {
        scope: {
          'dimension': '=myViewBox'
        },
        link: function(scope, element) {
          var svg;

          svg = element.get(0);
          svg.viewBox.baseVal.width = scope.dimension.width;
          svg.viewBox.baseVal.height = scope.dimension.height;
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
        'default': TPL_PATH + '/not-supported.html'
      }, factories = {

        'boxPlot': function buildScales(chart, width, height) {
          var d3 = $window.d3,
            xDomain = [],
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG(SVG_MARGIN, width, height);

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
            x1Domain = [],
            x2Domain = [],
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG({
            top: SVG_MARGIN.top,
            right: SVG_MARGIN.right,
            bottom: SVG_MARGIN.bottom + 20,
            left: SVG_MARGIN.left
          }, width, height);

          // Calculate min, max, median of ranges and set the domains
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].series.length; j++) {
              data[i].series[j].data.sort(d3.ascending);
              data[i].series[j].min = data[i].series[j].data[0];
              data[i].series[j].max = data[i].series[j].data.slice(-1)[0];
              data[i].series[j].median = d3.median(data[i].series[j].data);
              data[i].series[j].mean = d3.mean(data[i].series[j].data);

              yDomain.push(data[i].series[j].min);
              yDomain.push(data[i].series[j].max);
              x2Domain.push(data[i].series[j].name);
            }
            
            x1Domain.push(data[i].name);
          }

          yDomain.sort(d3.ascending);
          yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

          // Set scales
          chart.x1Scale = d3.scale.ordinal().
            domain(x1Domain).
            rangePoints([0, chart.svg.inWidth], 1);
          chart.x2Scale = d3.scale.ordinal().
            domain(x2Domain).
            rangePoints([0, chart.svg.inWidth], 1);
          chart.x3Scale = d3.scale.ordinal().
            domain(d3.range(x1Domain.length + 1)).
            rangePoints([0, chart.svg.inWidth], 0);
          chart.yScale = d3.scale.linear().
            domain(yDomain).
            range([chart.svg.inHeight, 0]).
            nice();
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

            console.dir(width);

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
