(function(){
  'use strict';


  // Declare app level module which depends on filters, and services
  angular.module('myApp', [
    'ngRoute',
    'myApp.config',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'
  ]).

  config(['$routeProvider', 'TPL_PATH', function($routeProvider, TPL_PATH) {
    $routeProvider.when('/', {templateUrl: TPL_PATH + '/home.html', controller: 'HomeCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
  
})();
