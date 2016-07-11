(function () {
  'use strict';

  angular
    .module('lastfm.login.services')
    .factory('Login', Login);

  Login.$inject = ['$http'];

  function Login($http) {
    var Login = {
      create: create,
      get: get,
    };

    return Login;

    

    function create(content) {
      return $http.post('/music/signup/', {
        username: content['username'],
        password: content['password']
      });
    }

    function get(content) {
      return $http.post('/music/login/', {
        username: content['username'],
        password: content['password']
      });
    }

    

  }
})();