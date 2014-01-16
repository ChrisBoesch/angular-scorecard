(function () {
  'use strict';

  angular.module('myApp.directives', ['myApp.config']).
    directive('myChart', function(TPL_PATH, SVG, SVG_MARGIN, $window) {
      var templates = {
        'boxPlot': TPL_PATH + '/boxplot.html',
        'groupedBoxPlot': TPL_PATH + '/groupedboxplot.html',
        'default': TPL_PATH + '/not-supported.html'
      }, factories = {
        'boxPlot': function buildScales(chart) {
          var d3 = $window.d3,
            xDomain = [],
            yDomain = [],
            data = chart.series;
          
          chart.svg=SVG();

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
        'groupedBoxPlot': function(chart) {
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
          });

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
        }
      };

      return {
        restrict: 'E',
        scope: {
          'chartData': '='
        },
        template: '<div class="graph" ng-include="template"></div>',
        link: function(scope){

          scope.$watch('chartData', function(){
            var gType;

            if (!scope.chartData) {
              return;
            }

            gType = scope.chartData.type;
            if (!templates[gType] || !factories[gType]) {
              scope.template = templates['default'];
              return;
            }

            factories[gType](scope.chartData);
            scope.template = templates[gType];
            console.dir(scope.chartData.svg);
          });
        }
      };
    });

})();
