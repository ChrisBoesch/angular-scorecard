(function () {
'use strict';

  angular.module('myApp.controllers', ['myApp.config']).

    controller('HomeCtrl', function ($scope) {
      $scope.who = 'World';
    })

  ;

})();
