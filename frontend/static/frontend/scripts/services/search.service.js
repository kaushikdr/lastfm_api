(function () {
  'use strict';

  angular
    .module('lastfm.search.services')
    .factory('Search', Search);

  Search.$inject = ['$http', '$cookies'];

  function Search($http, $cookies) {
    var Search = {
      get:get,
      post: post,
      similar:similar,
    };

    return Search;

    function get(content) {

      var config = { headers: { 'session_id': $cookies.get('session_id') } };  
      return $http.get('/music/search/', config);
    }


    function post(content) {

      var config = { headers: { 'session_id': $cookies.get('session_id') } };  
      return $http.post('/music/search/', 
        {
          artist:content
        },config);
    }

    function similar(content) {

      var config = { headers: { 'session_id': $cookies.get('session_id') } };  
      return $http.get('/music/similar/?artist='+content, config);
    }

    

  }
})();