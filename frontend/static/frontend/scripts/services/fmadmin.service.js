(function () {
  'use strict';

  angular
    .module('lastfm.fmadmin.services')
    .factory('Analytics', Analytics);

  Analytics.$inject = ['$http', '$cookies'];

  function Analytics($http, $cookies) {
    var Analytics = {
      get:get,
      login:login
    };

    return Analytics;

    function get() {

      var config = { headers: { 'session_id': $cookies.get('session_id') } };  
      return $http.get('/music/analytics/', config);
    }
    function login(content) {
      return $http.post('/music/admin_login/', {
        username: content['username'],
        password: content['password']
      });
    }


    

  }
})();