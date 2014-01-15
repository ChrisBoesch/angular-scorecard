/*global describe, beforeEach, it, inject, expect*/

(function () {
  'use strict';

  describe('services', function(){
    var $httpBackend, scope;

    beforeEach(module('myApp.services'));

    beforeEach(inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
    }));

    describe('dataset', function() {

      describe('all', function(){

        it('should return a promise', inject(function(dataset) {
          $httpBackend.whenGET('/api/v1').respond([]);
          expect(dataset.all().then).toBeDefined();
        }));

        it('should send a XHR requerest', inject(function(dataset) {
          var data;
          
          $httpBackend.expectGET('/api/v1').respond([{key:0}]);
          
          dataset.all().then(function(resp){
            data = resp;
          });

          $httpBackend.flush();
          expect(data.length).toBe(1);
          expect(data[0].key).toBe(0);
        }));

      });

      describe('get', function(){

        it('should return a promise', inject(function(dataset) {
          $httpBackend.whenGET('/api/v1/0').respond({});
          expect(dataset.get().then).toBeDefined();
        }));

        it('should send a XHR requerest', inject(function(dataset) {
          var data;
          
          $httpBackend.expectGET('/api/v1/0').respond(
            { title: 'Distribution of some Data'}
          );
          
          dataset.get(0).then(function(resp){
            data = resp;
          });

          $httpBackend.flush();
          expect(data.title).toBe('Distribution of some Data');
        }));

      });

    });

  });

})();