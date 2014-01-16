var express = require('express'),
  app = express(),
  _ = require('lodash');


// Simulate slow network with a delay
var DELAY = process.env.DELAY || 1000;

// Random data to serve
var DATA = [
  {
    title: 'Distribution of some Data',
    subtitle: 'Those data are random and harcoded.',
    type: 'boxPlot',
    series: [
      {name: 'AA', data: [48, 15, 57, 57, 10, 19, 69, 99, 81, 72]},
      {name: 'BBB', data: [4, 100, 37, 9, 46, 77, 28, 50, 80, 3]},
      {name: 'CCC', data: [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
    ]
  },
  // {
  //   title: 'Proportion of Some Data',
  //   subtitle: 'Those data are random and harcoded.',
  //   series: [
  //     {name: 'AAAAAA', value: 120},
  //     {name: 'BBBBBB', value: 180},
  //     {name: 'CCCCCC', value: 90},
  //   ]
  // },
  // {
  //   title: 'Proportion of Some groupe of Data',
  //   subtitle: 'Those data are random and harcoded.',
  //   series: [
  //     {name: 'AAAAAA', data: {'a': 48, 'b': 15, 'c': 57}},
  //     {name: 'BBBBBB', data: {'a': 4, 'b': 100, 'c': 37}},
  //     {name: 'CCCCCC', data: {'a': 33, 'b': 85, 'c': 34}},
  //   ]
  // },
  {
    title: 'Distribution of some group of Data',
    subtitle: 'Those data are random and harcoded.',
    type: 'groupedBoxPlot',
    series: [
      {
        name: 'AA',
        series: [
          {'name': 'A1', 'data': [48, 15, 57, 57, 10, 19, 69, 99, 81, 72]},
          {'name': 'A2', 'data': [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
        ]
      },
      {
        name: 'BBB',
        series: [
          {'name': 'B1', 'data': [4, 100, 37, 9, 46, 77, 28, 50, 80, 3]},
          {'name': 'B2', 'data': [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
        ]
      },
      {
        name: 'CCC',
        series: [
          {'name': 'C1', 'data': [48, 15, 57, 57, 10, 19, 69, 99, 81, 72]},
          {'name': 'C2', 'data': [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
        ]
      }
    ]
  },
];

app.use(express.bodyParser());

app.get('/', function(req, res) {
  setTimeout(function(){
    res.send(_.map(DATA, function(e, i){
      if (!e) {
        return;
      }
      return {'title': e.title, 'key': i};
    }));
  }, DELAY);
});

app.get('/:key(\\d*)', function(req, res) {
  var key = decodeURIComponent(req.params.key);

  setTimeout(function(){
    res.send(DATA[key]);
  }, DELAY);
});


app.listen(9090);

console.log('Listening on port 9090');
