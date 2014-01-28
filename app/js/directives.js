(function () {
  'use strict';

  angular.module('myApp.directives', ['myApp.config', 'myApp.filters', 'templates-main']).

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
     * scBoxPlot directive
     *
     * (not strictly speaking a boxplot, the box is missing)
     *
     * usage:
     *
     *  <sc-box-plot sc-data="data"/>
     */
    directive('scBoxPlot', function(TPL_PATH, SVG, $window) {
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/boxplot.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var onDataChange;

          scope.layout = SVG(
            {top: 10, right: 30, bottom: 30, left: 50},
            scope.width(),
            scope.height()
          );

          onDataChange = function() {
            var d3 = $window.d3,
              xDomain = [],
              yDomain = [];

            if (!scope.data || scope.data.type !== 'boxPlot') {
              return;
            }

            // Calculate min, max, median of ranges and set the domains
            for (var i = 0; i < scope.data.series.length; i++) {
              scope.data.series[i].data.sort(d3.ascending);
              scope.data.series[i].min = scope.data.series[i].data[0];
              scope.data.series[i].max = scope.data.series[i].data.slice(-1)[0];
              scope.data.series[i].median = d3.median(scope.data.series[i].data);
              
              yDomain.push(scope.data.series[i].min);
              yDomain.push(scope.data.series[i].max);
              xDomain.push(scope.data.series[i].name);
            }

            yDomain.sort(d3.ascending);
            yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

            // Set scales
            scope.xScale = d3.scale.ordinal().
              domain(xDomain).
              rangePoints([0, scope.layout.inWidth], 1);

            scope.yScale = d3.scale.linear().
              domain(yDomain).
              range([scope.layout.inHeight, 0]).
              nice();
          };

          scope.$watch('data', onDataChange);
        }
      };
    }).

    /**
     * scGroupedBoxPlot
     *
     * Like box plot except the data series are part of groups. The x axis
     * has two level. One level names the serie; the other one names the group
     * of the serie.
     *
     * usage:
     *
     *  <sc-grouped-box-plot sc-data="data"/>
     */
    directive('scGroupedBoxPlot', function(TPL_PATH, SVG, $window) {
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/groupedboxplot.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var d3 = $window.d3,
            onDataChange,
            leaf,
            root,
            yDomain = [];

          scope.layout=SVG(
            {top: 10, right: 30, bottom: 70, left: 50},
            scope.width(),
            scope.height()
          );

          onDataChange = function() {
            
            if (!scope.data || scope.data.type !== 'groupedBoxPlot') {
              return;
            }

            scope.xScale = d3.scale.ordinal();
            scope.yScale = d3.scale.linear();
            scope.legendScale = d3.scale.ordinal().
              domain(['median','mean']).
              rangeBands([0, scope.layout.inWidth], 0.5, 0.5);
            scope.xTree = [];
            
            // Calculate min, max, median of ranges and set the domains
            for (var i = 0; i < scope.data.series.length; i++) {
              root = scope.data.series[i];
              leaf = {'root': root.name, 'children': []};
              for (var j = 0; j < root.series.length; j++) {
                root.series[j].data.sort(d3.ascending);
                root.series[j].min = root.series[j].data[0];
                root.series[j].max = root.series[j].data.slice(-1)[0];
                root.series[j].median = d3.median(root.series[j].data);
                root.series[j].mean = d3.mean(root.series[j].data);

                yDomain.push(root.series[j].min);
                yDomain.push(root.series[j].max);
                scope.xScale(root.series[j].name);
                leaf.children.push(root.series[j].name);
              }
              scope.xTree.push(leaf);
            }

            yDomain.sort(d3.ascending);
            yDomain = yDomain.slice(0,1).concat(yDomain.slice(-1));

            // Set scales
            scope.xScale = scope.xScale.rangeBands([0, scope.layout.inWidth], 0, 0);
            scope.yScale = scope.yScale.domain(yDomain).
              range([scope.layout.inHeight, 0]).
              nice();
          };

          scope.$watch('data', onDataChange);
        }
      };
    }).

    /**
     * Draw a bar chart
     * 
     */
    directive('scBar', function(TPL_PATH, SVG_MARGIN, SVG, $window){
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/bar.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var d3 = $window.d3,
            onDataChange;

          scope.layout=SVG(SVG_MARGIN, scope.width(), scope.height());

          onDataChange = function(){
            var yDomain = [];

            if (!scope.data || scope.data.type !== 'bar') {
              return;
            }

            scope.xScale = d3.scale.ordinal();
            scope.yScale = d3.scale.linear();
            scope.yAxisScale = d3.scale.linear();

            for (var i = 0; i < scope.data.series.length; i++) {
              scope.xScale(scope.data.series[i].name);
              yDomain.push(scope.data.series[i].data);
            }

            yDomain.sort(d3.ascending);
            // TODO: Fix  hardcoded Domain
            yDomain = [0].concat(yDomain.slice(-1));
            yDomain[1] *= 1.1;
            scope.yScale = scope.yScale.domain(yDomain);
            scope.yAxisScale = scope.yAxisScale.domain(yDomain);

            // Set scales
            scope.xScale = scope.xScale.rangePoints([0, scope.layout.inWidth], 1);
            scope.yScale = scope.yScale.range([0, scope.layout.inHeight]).nice();
            scope.yAxisScale = scope.yAxisScale.
              range([scope.layout.inHeight, 0]).
              nice();
          };

          scope.$watch('data', onDataChange);
        }
      };
    }).

    /**
     * Draw a grouped bar chart
     * 
     */
    directive('scGroupedBar', function(TPL_PATH, SVG, $window){
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/groupedbar.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var d3 = $window.d3,
            onDataChange;

          scope.layout=SVG(
            {
              top: 30,
              right: 30,
              bottom: 60,
              left: 70
            },
            scope.width(),
            scope.height()
          );

          onDataChange = function(){
            var yDomain = [],
              entries;

            if (!scope.data || scope.data.type !== 'groupedBar') {
              return;
            }

            scope.xScale = d3.scale.ordinal();
            scope.xNestedScale = d3.scale.ordinal();

            // calculate scales domains
            // y scales will use a range domain from 0 (to fix) to max value
            for (var i = 0; i < scope.data.series.length; i++) {
              scope.xScale(scope.data.series[i].name);
              entries = d3.entries(scope.data.series[i].data);
              for (var j = 0; j < entries.length; j++) {
                yDomain.push(entries[j].value);
                scope.xNestedScale(entries[j].key);
              }
            }

            yDomain.sort(d3.ascending);
            // TODO: Fix  hardcoded Domain low
            yDomain = [0].concat(yDomain.slice(-1));

            // Set scales
            scope.xScale = scope.xScale.rangeBands([0, scope.layout.inWidth], 0, 0);
            scope.xAxisScale = scope.xScale.copy().rangePoints([0, scope.layout.inWidth], 1);
            scope.xNestedScale = scope.xNestedScale.
              rangeBands([0, scope.layout.inWidth/scope.xScale.domain().length], 0, 0.5);
            scope.colors = d3.scale.category20();
            scope.legendScale = scope.xNestedScale.copy().
              rangeBands([0, scope.layout.inWidth], 0.5, 0.5);
            scope.yScale = d3.scale.linear().
              domain(yDomain).
              range([0, scope.layout.inHeight]).
              nice();
            scope.yAxisScale = d3.scale.linear().
              domain(yDomain).
              range([scope.layout.inHeight, 0]).
              nice();

          };

          scope.$watch('data', onDataChange);
        }
      };
    }).

    /**
     * Draw a pie chart
     * 
     */
    directive('scPie', function(TPL_PATH, SVG_MARGIN, SVG, $window){
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/pie.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var d3 = $window.d3,
            onDataChange,
            onSeriesLenghtChange,
            serieCount = 0;

          if (scope.data && scope.data.series) {
            serieCount = scope.data.series.length || 0;
          }

          onSeriesLenghtChange = function(){
            scope.layout=SVG(
              {
                top: 10,
                right: 10,
                bottom: 30 + (20 * serieCount),
                left: 10
              },
              scope.width(),
              scope.height()
            );
          };

          onDataChange = function(){
            var percentage,
              formatter = d3.format(".01%");

            if (!scope.data || scope.data.type !== 'pie') {
              return;
            }

            // Make sure the pie fits into the inner svg document,
            // and sure the legend aligns with the pie
            if (scope.layout.inHeight > scope.layout.inWidth) {
              scope.pieRadius = scope.layout.inWidth/2;
              scope.legendXAnchor = 0;
            } else {
              scope.pieRadius = scope.layout.inHeight/2;
              scope.legendXAnchor = (scope.layout.inWidth - scope.pieRadius*2)/2;
            }

            scope.pieData = d3.layout.pie().
              value(function(d){return d.data;})(scope.data.series);

            scope.colors = d3.scale.category20();

            percentage = d3.scale.linear().
              domain([0, d3.sum(scope.data.series, function(d){ return d.data; })]).
              range([0,1]);

            scope.percentage = function(d){
              var p = percentage(d);
              return formatter(p);
            };

            scope.arc = d3.svg.arc()
              .startAngle(function(d){ return d.startAngle; })
              .endAngle(function(d){ return d.endAngle; })
              .innerRadius(0)
              .outerRadius(scope.pieRadius);
          };

          // TODO: the order matters... might break.
          scope.$watch('data.series.lenght', onSeriesLenghtChange);
          scope.$watch('data', onDataChange);
        }
      };
    }).

    /**
     * Draw two or more charts side by side
     *  
     */
    
    directive('scCombined', function(TPL_PATH, SVG) {
      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/combined.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          scope.layout=SVG(
            {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            scope.width(),
            scope.height()
          );
        }
      };
    }).

    /**
     * Draw a stacked bar chart
     * 
     */
    directive('scStackedBar', function(TPL_PATH, SVG, $window){
      var d3 = $window.d3;

      return {
        restrict: 'E',
        templateUrl: TPL_PATH + '/stackedbar.html',
        scope: {
          data: '=scData',
          width: '&scWidth',
          height: '&scHeight'
        },
        link: function(scope) {
          var onDataChange;

          scope.layout=SVG(
            { top: 10, right: 10, bottom: 70, left: 70},
            scope.width(),
            scope.height()
          );

          onDataChange = function(){
            var stacks, stackData, componentNames, yDomain = [], nameAccessor;

            if (!scope.data || scope.data.type !== 'stackedBar') {
              return false;
            }

            // extract stacked and assemble them
            stacks = scope.data.series.filter(function(x){return x.type === 'bar';});
            stackData = d3.transpose(stacks.map(function(x){return x.data;}));
            componentNames = stacks.map(function(x){return x.name;});

            scope.stacks = stackData.map(function(rawStack){
              return rawStack.reduce(function(stack, curr, i){
                var prev = stack.slice(-1)[0] || {'stackValue': 0},
                  value = parseInt(curr, 10),
                  component = {
                    name: componentNames[i],
                    value: value,
                    stackValue: prev.stackValue + value
                  };

                stack.push(component);
                return stack;
              }, []).reverse();
            });
            scope.stacks.componentNames = componentNames;

            // extract lines
            scope.lines = scope.data.series.filter(function(x){return x.type === 'line';});

            // get min and max value
            scope.stacks.reduce(function(domain, stack){
              domain.push(stack[0].stackValue);
              domain.push(stack[stack.length -1].stackValue);
              return domain;
            }, yDomain);

            yDomain = d3.extent(yDomain);

            // They can be overwritten
            if (angular.isDefined(scope.data.axisY.min)) {
              yDomain[0] = scope.data.axisY.min;
            }

            if (angular.isDefined(scope.data.axisY.max)) {
              yDomain[1] = scope.data.axisY.max;
            }

            // build scales
            scope.xScale = d3.scale.ordinal().
              domain(scope.data.axisX.categories).
              rangePoints([0, scope.layout.inWidth], 1);
            scope.yScale = d3.scale.linear().
              domain(yDomain).
              range([0, scope.layout.inHeight]);
            scope.yAxisScale = scope.yScale.copy().
              range([scope.layout.inHeight, 0]);
            scope.colors = d3.scale.category20();
            
            scope.legendScale = d3.scale.ordinal();
            nameAccessor = function(scale, serie){
              scale(serie.name);
              return scale;
            };
            stacks.reduce(nameAccessor, scope.legendScale);
            scope.lines.reduce(nameAccessor, scope.legendScale);
            scope.legendScale = scope.legendScale.rangeBands([0, scope.layout.inWidth], 0.5, 0.5);
          };

          scope.$watch('data', onDataChange);

        }
      };
    });

})();
