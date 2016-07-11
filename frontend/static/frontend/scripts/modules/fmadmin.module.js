(function(){
  'use strict';

  angular
    .module('lastfm.fmadmin', [
      'lastfm.fmadmin.controllers',
      'lastfm.fmadmin.services'
    ]);

  angular
    .module('lastfm.fmadmin.controllers', ['ngCookies']);
  angular
    .module('lastfm.fmadmin.services', []);

})();