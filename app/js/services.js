(function () {
  'use strict';

  angular.module('myApp.services', ['myApp.config', 'ngResource']).

    factory('dataset', function($resource, $q, API_BASE){
      // TODO: add support for cursor
      var res = $resource(API_BASE + '/:key', {key:'@key'});
      var api = {
        // TODO: just use $http cache and only merge concurent request
        chartList: null,
        loading: null,
        charts: {},

        all: function() {
          if (api.chartList) {
            return $q.when(api.chartList);
          }

          if (api.loading) {
            return api.loading;
          }

          api.loading = res.query().$promise.then(function (list) {
            api.chartList = list;
            return list;
          })['finally'](function(){
            api.loading = null;
          });

          return api.loading;
        },

        get: function(key) {
          return res.get({key: key}).$promise;
        }

      };

      return api;
    })
    
    ;

})();
