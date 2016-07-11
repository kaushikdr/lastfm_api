(function () {
  'use strict';

  angular
    .module('lastfm.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/', {
      // controller: 'LayoutController',
      // controllerAs: 'vm',
      templateUrl: '/lastfm_static/frontend/templates/layout.html'
    })
    .when('/fmadmin/', {
      // controller: 'LayoutController',
      // controllerAs: 'vm',
      templateUrl: '/lastfm_static/frontend/templates/fmadmin.html'
    }).otherwise('/');
  }
})();