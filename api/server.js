var express = require('express'),
  app = express(),
  _ = require('lodash');


// Simulate slow network with a delay
var DELAY = process.env.DELAY || 1000;

// Random data to serve
var DATA = [
  {
    title: 'Title1 Example',
    subtitle: 'The description of the graph that can be about two lines long ' +
                'usually so it is shown as wrapped here.',
    type: 'boxPlot',
    axisY: {
      name: 'Score'
    },
    series: [
      {name: 'AA', data: [48, 15, 57, 57, 10, 19, 69, 99, 81, 72]},
      {name: 'BBB', data: [4, 100, 37, 9, 46, 77, 28, 50, 80, 3]},
      {name: 'CCC', data: [33, 85, 34, 93, 21, 30, 15, 11, 14, 14]},
    ]
  },
  {
    title: 'Title 2 This is how the other screen should look with a title like this one',
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
  },

  {
    title: 'Title 3 This is how the other screen should look with a title like this one',
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
    title: 'Title 4 This is how the other screen should look with a title like this one',
    type: 'pie',
    subtitle: 'The Pie Chart Header',
    series: [
      {name: 'AAAAAA', data:  40},
      {name: 'BBBBBB', data:  110},
      {name: 'CCCCCCCCCC', data:  30},
      {name: 'DDDDDDDDDDDD', data:  3}
    ]
  },

  {
    title: 'Title 5 For these type of views there is this bolded text at the top and usually about three lines of text which I am simulating by typing a lot of words.',
    subtitle: 'Here We Have the Title of the Slide',
    type: 'groupedBar',
    axisY: {
      name: 'Percentage (%)',
      categories: ['c1', 'c2', 'c3', 'c4', ]
    },
    series: [
      {name: 'AAAA', data: [100, 100, 100, 95]},
      {name: 'BBBB', data: [100, 100, 100, 95]},
      {name: 'CCCC', data: [98, 29, null, 95]},
      {name: 'DDDD', data: [100, 100, 100, 95]},
    ]
  },
  {
    title: 'This is Title 6',
    subtitle: 'This description could also be one or two lines long. Notice the two level categories in the X axis',
    type: 'groupedBoxPlot',
    axisY: {
      name: 'score'
    },
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
  {
    title: 'Title 7',
    type: 'stackedBar',
    subtitle: 'This graph has a stacked bar chart of two items and also has a green target line that runs across the top based on numbers passed in like 90 or 95',
    axisY: {
      name:'Percentage (%)',
      min: 0,
      max: 100,
    },
    axisX: {
      categories: ['AAAA', 'BBBB', 'CCCC', 'DDDD', 'EEEE']
    },
    series: [
      {
        'type': 'bar',
        'name': 'color1',
        'data': ['98', '98', '98', '98', '96']
      },
      {
        'type': 'bar',
        'name': 'color2',
        'data': ['2', '5', '2', '2', '4']
      },
      {
        'type': 'line',
        'name': 'target',
        'data': ['90', '90', '90', '90', '96']
      },
    ]
  }
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
