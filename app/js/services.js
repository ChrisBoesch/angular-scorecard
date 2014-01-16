(function () {
  'use strict';

  angular.module('myApp.services', ['myApp.config', 'ngResource']).

    factory('dataset', function($resource, API_BASE){
      var res = $resource(API_BASE + '/:key', {key:'@key'});

      return {
        all: function() {
          return res.query().$promise;
        },
        get: function(key) {
          return res.get({key: key}).$promise;
        }
      };
    })
    
    ;

})();
