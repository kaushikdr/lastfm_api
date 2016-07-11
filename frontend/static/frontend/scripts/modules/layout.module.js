(function(){
  'use strict';

  angular
    .module('lastfm.layout', [
      'lastfm.layout.controllers',
    ]);

  angular
    .module('lastfm.layout.controllers', ['ngCookies']);

})();