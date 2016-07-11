(function(){
  'use strict';

  angular
    .module('lastfm.artist', [
      'lastfm.artist.controllers',
    ]);

  angular
    .module('lastfm.artist.controllers', ['ngCookies']);

})();