(function () {
  'use strict';
  
  angular.module('myApp.config', ['ngRoute']).

    constant('TPL_PATH', '/partials').
    constant('API_BASE', '/api/v1')

    ;
  
})();