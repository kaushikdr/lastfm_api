(function () {
  'use strict';

    angular
        .module('lastfm', [
          'lastfm.routes',
          'lastfm.config',
          'lastfm.layout',
          'lastfm.login',
          'lastfm.search',
          'lastfm.artist',
          'lastfm.fmadmin'
        ]);


    angular
        .module('lastfm.routes', ['ngRoute']);

    angular
        .module('lastfm.config', []);
})();
