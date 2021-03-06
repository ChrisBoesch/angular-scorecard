angular.module('templates-main', ['partials/bar.html', 'partials/boxplot.html', 'partials/chart.html', 'partials/combined.html', 'partials/groupedbar.html', 'partials/groupedboxplot.html', 'partials/home.html', 'partials/pie.html', 'partials/stackedbar.html']);

angular.module("partials/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/bar.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "  <svg>\n" +
    "\n" +
    "    <!-- Draw the y axis, its ticks and rulers -->\n" +
    "    <sc-r-axis sc-scale=\"yAxisScale\" sc-layout=\"layout\" title=\"data.axisY.name\"></sc-r-axis>\n" +
    "\n" +
    "    <!-- Draw bars and labels-->\n" +
    "    <g class=\"serie\" ng-repeat=\"serie in data.series\" \n" +
    "      ng-attr-transform=\"translate({{xScale(serie.name)}},{{layout.inHeight - yScale(serie.data)}})\"\n" +
    "    >\n" +
    "      <rect class=\"bar\" x=\"-20\" width=\"40\" ng-attr-height=\"{{yScale(serie.data)}}\"/>\n" +
    "      <text class=\"bar-label\" dy=\"-10\">\n" +
    "        {{serie.data}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "\n" +
    "    <!-- Draw x axis and the ticks -->\n" +
    "    <sc-b-axis sc-scale=\"xScale\" sc-layout=\"layout\"></sc-b-axis>\n" +
    "  </svg>\n" +
    "</scce-svg-container>");
}]);

angular.module("partials/boxplot.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/boxplot.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "  <svg>\n" +
    "    <!-- Draw the y axis, the ticks and rulers -->\n" +
    "    <sc-r-axis sc-scale=\"yScale\" sc-layout=\"layout\" title=\"data.axisY.name\"></sc-r-axis>\n" +
    "\n" +
    "    <!-- Draw x axis and its ticks -->\n" +
    "    <sc-b-axis sc-scale=\"xScale\" sc-layout=\"layout\"></sc-b-axis>\n" +
    "\n" +
    "\n" +
    "    <!-- Draw the representation of the series distribution -->\n" +
    "    <g class=\"serie\"\n" +
    "      ng-repeat=\"serie in data.series\"\n" +
    "      ng-attr-transform=\"translate({{xScale(serie.name)}},0)\"\n" +
    "    >\n" +
    "      <!-- The line between min and max point-->\n" +
    "      <line  class=\"distribution\"\n" +
    "        ng-attr-y1=\"{{yScale(serie.min)}}\" \n" +
    "        ng-attr-y2=\"{{yScale(serie.max)}}\"\n" +
    "      />\n" +
    "      <!-- the min point -->\n" +
    "      <line class=\"min\"\n" +
    "        x1=\"-5\" x2=\"5\"\n" +
    "        ng-attr-y1=\"{{yScale(serie.min)}}\" \n" +
    "        ng-attr-y2=\"{{yScale(serie.min)}}\"\n" +
    "      />\n" +
    "      <!-- the max point -->\n" +
    "      <line class=\"max\"\n" +
    "        x1=\"-5\" x2=\"5\"\n" +
    "        ng-attr-y1=\"{{yScale(serie.max)}}\" \n" +
    "        ng-attr-y2=\"{{yScale(serie.max)}}\"\n" +
    "      />\n" +
    "      <!-- add a rectangle for the median -->\n" +
    "      <rect class=\"median\"\n" +
    "        width=\"10\" height=\"10\" x=\"-5\"\n" +
    "        ng-attr-y=\"{{yScale(serie.median) - 5}}\"\n" +
    "      />\n" +
    "      <text class=\"median-label\" x=\"10\" ng-attr-y=\"{{yScale(serie.median)}}\">\n" +
    "        {{serie.median}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "\n" +
    "  </svg>\n" +
    "</scce-svg-container>");
}]);

angular.module("partials/chart.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/chart.html",
    "<div ng-switch on=\"data.type\">\n" +
    "  \n" +
    "  <div class=\"chart\" ng-switch-when=\"boxPlot\">\n" +
    "    <sc-box-plot sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "  \n" +
    "  <div class=\"chart\" ng-switch-when=\"groupedBoxPlot\">\n" +
    "    <sc-grouped-box-plot sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chart\" ng-switch-when=\"bar\">\n" +
    "    <sc-bar sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chart\" ng-switch-when=\"groupedBar\">\n" +
    "    <sc-grouped-bar sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chart\" ng-switch-when=\"pie\">\n" +
    "    <sc-pie sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chart\" ng-switch-when=\"stackedBar\">\n" +
    "    <sc-stacked-bar sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"chart\" ng-switch-when=\"combined\">\n" +
    "    <sc-combined sc-data=\"data\"/>\n" +
    "  </div>\n" +
    "  \n" +
    "</div>");
}]);

angular.module("partials/combined.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/combined.html",
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-{{12 / data.series.length}}\" ng-repeat=\"c in data.series\">\n" +
    "    <div ng-switch on=\"c.type\">\n" +
    "      \n" +
    "      <div class=\"chart\" ng-switch-when=\"boxPlot\">\n" +
    "        <sc-box-plot sc-data=\"c\" sc-width=\"layout.width / data.series.length\"/>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"chart\" ng-switch-when=\"groupedBoxPlot\">\n" +
    "        <sc-grouped-box-plot sc-data=\"c\" sc-width=\"layout.width / data.series.length\"/>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"chart\" ng-switch-when=\"bar\">\n" +
    "        <sc-bar sc-data=\"c\" sc-width=\"layout.width / data.series.length\"/>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"chart\" ng-switch-when=\"groupedBar\">\n" +
    "        <sc-grouped-bar sc-data=\"c\" sc-width=\"layout.width / data.series.length\"/>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"chart\" ng-switch-when=\"pie\">\n" +
    "        <sc-pie sc-data=\"c\" sc-width=\"layout.width / data.series.length\"/>\n" +
    "      </div>\n" +
    "      \n" +
    "    </div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/groupedbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/groupedbar.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "\n" +
    "  <svg>\n" +
    "    <!-- Draw the y axis, ticks and rulers -->\n" +
    "    <sc-r-axis sc-scale=\"yAxisScale\" sc-layout=\"layout\" title=\"data.axisY.name\"></sc-r-axis>\n" +
    "\n" +
    "    <g class=\"serie\" ng-repeat=\"serie in data.series\"\n" +
    "      ng-attr-transform=\"translate({{xScale(serie.name)}},0)\"\n" +
    "    >\n" +
    "      <g class=\"group\" ng-repeat=\"name in xNestedScale.domain()\"  ng-if=\"serie.data[$index]\"\n" +
    "        ng-attr-transform=\"translate({{xNestedScale(name)}}, {{layout.inHeight - yScale(serie.data[$index])}})\"\n" +
    "      >\n" +
    "        <rect class=\"bar\"\n" +
    "          ng-attr-width=\"{{xNestedScale.rangeBand()}}\"\n" +
    "          ng-attr-height=\"{{yScale(serie.data[$index])}}\"\n" +
    "          ng-attr-style=\"fill: {{colors(name)}}\"\n" +
    "        />\n" +
    "        <text class=\"bar-label\"\n" +
    "          y=\"-10\"\n" +
    "          ng-attr-dx=\"{{xNestedScale.rangeBand()/2}}\" \n" +
    "        >\n" +
    "          {{name}}\n" +
    "        </text>\n" +
    "      </g>\n" +
    "    </g>\n" +
    "\n" +
    "    <!-- Draw the x axis, ticks and the legend-->\n" +
    "    <sc-b-axis sc-scale=\"xAxisScale\" sc-layout=\"layout\"></sc-b-axis>\n" +
    "\n" +
    "    <g class\"legend\"\n" +
    "      ng-repeat=\"name in legendScale.domain()\"\n" +
    "      ng-attr-transform=\"translate({{legendScale(name)}}, {{layout.inHeight + 50}})\"\n" +
    "    >\n" +
    "      <rect class=\"bar\" width=\"10\" height=\"10\" ng-attr-style=\"fill: {{colors(name)}}\"/>\n" +
    "      <text dx=\"20\" dy=\"10\" style=\"text-anchor: start; alignment-baseline: auto\">\n" +
    "        {{name}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "\n" +
    "  </svg>\n" +
    "</scce-svg-container>");
}]);

angular.module("partials/groupedboxplot.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/groupedboxplot.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "  <svg>    \n" +
    "    <!-- Draw the y axis and the ticks -->\n" +
    "    <sc-r-axis sc-scale=\"yScale\" sc-layout=\"layout\" title=\"data.axisY.name\"></sc-r-axis>\n" +
    "\n" +
    "    <!-- Draw the representation of the series distribution -->\n" +
    "    <g class=\"grouped-serie\" ng-repeat=\"gserie in data.series\">\n" +
    "      <g class=\"serie\" ng-repeat=\"serie in gserie.series\" ng-attr-transform=\"translate({{xScale(serie.name) + xScale.rangeBand()/2}},0)\">\n" +
    "        <line  class=\"distribution\"\n" +
    "          x1=\"0\" x2=\"0\"\n" +
    "          ng-attr-y1=\"{{yScale(serie.min)}}\" \n" +
    "          ng-attr-y2=\"{{yScale(serie.max)}}\"\n" +
    "        />\n" +
    "        <line class=\"min\"\n" +
    "          x1=\"-5\" x2=\"5\"\n" +
    "          ng-attr-y1=\"{{yScale(serie.min)}}\" \n" +
    "          ng-attr-y2=\"{{yScale(serie.min)}}\"\n" +
    "        />\n" +
    "        <line class=\"max\"\n" +
    "          x1=\"-5\" x2=\"5\"\n" +
    "          ng-attr-y1=\"{{yScale(serie.max)}}\" \n" +
    "          ng-attr-y2=\"{{yScale(serie.max)}}\"\n" +
    "        />\n" +
    "        <rect class=\"mean\"\n" +
    "          x=\"-10\"\n" +
    "          ng-attr-y=\"{{yScale(serie.mean) - 10}}\" \n" +
    "          width=\"20\" height=\"5\"\n" +
    "        />\n" +
    "        <text class=\"mean-label\" x=\"20\" ng-attr-y=\"{{yScale(serie.mean)}}\">\n" +
    "          {{serie.mean|round:1}}\n" +
    "        </text>\n" +
    "        <rect class=\"median\"\n" +
    "          x=\"-5\" ng-attr-y=\"{{yScale(serie.median) - 5}}\" \n" +
    "          width=\"10\" height=\"10\"\n" +
    "        />\n" +
    "        <text class=\"median-label\" x=\"10\" ng-attr-y=\"{{yScale(serie.median)}}\" >\n" +
    "          {{serie.median|round:1}}\n" +
    "        </text>\n" +
    "      </g>\n" +
    "    </g>\n" +
    "\n" +
    "      <!-- Draw x axis, its ticks and rulers -->\n" +
    "    <sc-b-nested-axis sc-scale=\"xScale\" sc-tree=\"xTree\" sc-layout=\"layout\"></sc-b-nested-axis>\n" +
    "\n" +
    "    <g class=\"legend\">\n" +
    "      <g class=\"median-legend\"\n" +
    "        ng-attr-transform=\"translate({{legendScale('median')}},{{layout.height - 20}})\"\n" +
    "      >\n" +
    "        <rect class=\"median\" width=\"10\" height=\"10\"/>\n" +
    "        <text dx=\"20\" dy=\"10\" style=\"text-anchor: start; alignment-baseline: auto\">\n" +
    "          median\n" +
    "        </text>\n" +
    "      </g>\n" +
    "      <g class=\"mean-legend\"\n" +
    "        ng-attr-transform=\"translate({{legendScale('mean')}},{{layout.height - 20}})\"\n" +
    "      >\n" +
    "        <rect class=\"mean\" dy=\"4\" width=\"20\" height=\"5\"/>\n" +
    "        <text dx=\"30\" dy=\"10\" style=\"text-anchor: start; alignment-baseline: auto\">\n" +
    "          mean\n" +
    "        </text>\n" +
    "      </g>\n" +
    "    </g>\n" +
    "  </svg>\n" +
    "</scce-svg-container>\n" +
    "");
}]);

angular.module("partials/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/home.html",
    "\n" +
    "<div id=\"header\" class=\"row\" ng-controller=\"SidebarCtrl\">\n" +
    "\n" +
    "  <div class=\"nav\">\n" +
    "     <a ng-href=\"{{prev()}}\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>\n" +
    "     <a ng-href=\"{{next()}}\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-sm-3 col-sm-push-9\">\n" +
    "    <div class=\"dropdown\">\n" +
    "      <p class=\"dropdown-toggle\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-lg btn-block\">Charts</button>\n" +
    "      </p>\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li ng-repeat=\"g in dataset.chartList\"><a ng-href=\"#/{{$index + 1}}/{{g.key}}\">Chart #{{$index + 1}}</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-sm-9 col-sm-pull-3\">\n" +
    "      <h2>\n" +
    "        <span class=\"key\">#{{label}}. </span>\n" +
    "        <span class=\"title\">{{data.title}}</span>\n" +
    "      </h2>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-sm-12\">\n" +
    "    <wave-spinner ng-show=\"loading\"></wave-spinner>\n" +
    "    <sc-chart sc-data=\"data\"></sc-data>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("partials/pie.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/pie.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "  <svg>\n" +
    "		<g class=\"pie\"ng-attr-transform=\"translate({{layout.inWidth / 2}},{{layout.inHeight / 2}})\">\n" +
    "			<g class=\"slice\" ng-repeat=\"a in pieData\">\n" +
    "				<path\n" +
    "					ng-attr-d={{arc(a)}}\n" +
    "					ng-attr-style=\"fill: {{colors(a.data.name)}};\"\n" +
    "					/>\n" +
    "				<text\n" +
    "					ng-attr-transform=\"translate({{arc.centroid(a).join(',')}})\"\n" +
    "					dy=\".35em\"\n" +
    "					style=\"text-anchor: middle\"\n" +
    "					>\n" +
    "					{{percentage(a.data.data)}}\n" +
    "				</text>\n" +
    "			</g>\n" +
    "		</g>\n" +
    "\n" +
    "		<g class=\"legend\" ng-repeat=\"a in pieData\"\n" +
    "			ng-attr-transform=\"translate({{legendXAnchor}}, {{layout.height - (pieData.length - $index) * 20 - 15}})\"\n" +
    "		>\n" +
    "			<rect\n" +
    "				width=\"12\"\n" +
    "				height=\"12\"\n" +
    "				ng-attr-style=\"fill: {{colors(a.data.name)}}\"\n" +
    "			/>\n" +
    "			<text dx=\"20\" dy=\"12\" style=\"alignment-baseline: auto\">{{a.data.name}}</text>\n" +
    "		</g>\n" +
    "	</svg>\n" +
    "</scce-svg-container>");
}]);

angular.module("partials/stackedbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/stackedbar.html",
    "<h3 class=\"desc\">{{data.subtitle}}</h3>\n" +
    "<scce-svg-container scce-viewbox=\"layout\">\n" +
    "  <svg>\n" +
    "    <defs>\n" +
    "      <clipPath id=\"cut-off-top\">\n" +
    "        <rect x=\"-20\" y=\"0\" width=\"40\" ng-attr-height=\"{{layout.inHeight}}\"/>\n" +
    "      </clipPath>\n" +
    "    </defs>\n" +
    "\n" +
    "    <!-- Draw the y axis, its ticks and rulers -->\n" +
    "    <sc-r-axis sc-scale=\"yAxisScale\" sc-layout=\"layout\" title=\"data.axisY.name\"></sc-r-axis>\n" +
    "\n" +
    "    <g class=\"stack\" \n" +
    "      ng-repeat=\"name in xScale.domain()\"\n" +
    "      ng-attr-transform=\"translate({{xScale(name)}},0)\"\n" +
    "    >\n" +
    "      <rect ng-repeat=\"component in stacks[$index]\"\n" +
    "        width=\"40\" ng-attr-height=\"{{yScale(component.stackValue)}}\"\n" +
    "        x=\"-20\" ng-attr-y=\"{{layout.inHeight - yScale(component.stackValue)}}\"\n" +
    "        ng-attr-style=\"fill: {{colors(component.name)}}\"\n" +
    "        clip-path=\"url(#cut-off-top)\"/>\n" +
    "      <text ng-repeat=\"component in stacks[$index]\"\n" +
    "        ng-attr-y=\"{{layout.inHeight - yScale(component.stackValue - component.value/2)}}\"\n" +
    "        style=\"dominant-baseline: middle; text-anchor: middle;\"\n" +
    "      >\n" +
    "        {{component.value}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "\n" +
    "    <polyline class=\"line\" ng-repeat=\"line in lines\"\n" +
    "      ng-attr-points=\"{{line.data|points:xScale:yAxisScale}}\"\n" +
    "      ng-attr-style=\"stroke: {{colors(line.name)}};stroke-width: 3;fill: none;\"\n" +
    "    />\n" +
    "\n" +
    "    <!-- Draw x axis and the ticks -->\n" +
    "    <sc-b-axis sc-scale=\"xScale\" sc-layout=\"layout\"></sc-b-axis>\n" +
    "\n" +
    "    <g class\"legend\"\n" +
    "      ng-repeat=\"name in stacks.componentNames\"\n" +
    "      ng-attr-transform=\"translate({{legendScale(name)}}, {{layout.height - 30}})\"\n" +
    "    >\n" +
    "      <rect class=\"bar\" width=\"10\" height=\"10\" ng-attr-style=\"fill: {{colors(name)}}\"/>\n" +
    "      <text dx=\"20\" dy=\"10\" style=\"text-anchor: start; alignment-baseline: auto\">\n" +
    "        {{name}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "    <g class\"legend\"\n" +
    "      ng-repeat=\"line in lines\"\n" +
    "      ng-attr-transform=\"translate({{legendScale(line.name)}}, {{layout.height - 30}})\"\n" +
    "    >\n" +
    "      <line class=\"line\" x1=\"0\" x2=\"20\" y1=\"5\" y2=\"5\" ng-attr-style=\"stroke: {{colors(line.name)}}; stroke-width: 3;\"/>\n" +
    "      <text dx=\"30\" dy=\"10\" style=\"text-anchor: start; alignment-baseline: auto\">\n" +
    "        {{line.name}}\n" +
    "      </text>\n" +
    "    </g>\n" +
    "\n" +
    "  </svg>\n" +
    "</scce-svg-container>");
}]);
