
(function () {
    'use strict';

    angular
        .module('lastfm.artist.controllers')
        .controller('ArtistController', ArtistController);

    ArtistController.$inject = ['$scope', '$rootScope', '$cookies', '$timeout', 'Login', 'Search'];

    function ArtistController($scope, $rootScope, $cookies, $timeout, Login, Search) {
    	$scope.all_similar = false
    	$scope.result = false
    	$scope.history = false
    	$scope.empty = true
    	$scope.empty_state = "Please Search for an artists."
    	$scope.searching_similar = false

		
		$scope.empty = true
		$rootScope.$on('parent', function(event, data) {
		    if(data['pass'] == 'searchresult'){

		    	$scope.all_similar = false
		    	$scope.result = true
		    	$scope.empty = false
		    	$scope.history = false

		    	$rootScope.artist = data['searchkey'] 
		       	console.log(data['result'])
		       	var data = data['result']
		       	$scope.artist_img = data.artist_info.artist.image[3]['#text']
		       	$scope.artist_name = data.artist_info.artist.name
		       	$scope.listener = data.artist_info.artist.stats.listeners
		       	$scope.tags = data.artist_info.artist.tags.tag
		       	$scope.bio_string = data.artist_info.artist.bio.content
		        if ($scope.bio_string.length > 600){
		            $scope.bio = $scope.bio_string.substr(0,600)+'...'; 
		            $scope.read_more = true;
		       	}else{
		            $scope.bio = $scope.bio_string; 
		            $scope.read_more = false;
		       	}
		       	$scope.tracks = data.tracks.toptracks.track.slice(0, 10);
		       	$scope.albums = data.albums.topalbums.album.slice(0, 10);
		       	$scope.similar = []
		       	var similar_artist = data.artist_info.artist.similar.artist
		       	for (var sim in similar_artist){
		       		// console.log(similar_artist[sim])
		       		$scope.similar.unshift({'image':similar_artist[sim].image[2]['#text'], 'name':similar_artist[sim].name})

		       	}
		       	// console.log($scope.similar)
		        
		    }
		    else if (data['pass'] == 'notfound'){
				$scope.all_similar = false
				$scope.history = false
		    	$scope.result = false
		    	$scope.empty = true
		    	$scope.empty_state = data['searchkey'] +" artist is not found. Please search a different artist."
		    }
		    else if (data['pass'] == 'history'){
		    	$scope.all_similar = false
				$scope.history = true
		    	$scope.result = false
		    	$scope.empty = false
		    	$scope.history_data = data['data']
		    }
		})
		$scope.searchSimilar = function(){
			$scope.searching_similar = true
			console.log($rootScope.artist)
			Search.similar($rootScope.artist).then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  // $scope.genres = data.data;
			  // $scope.genre_list = $scope.genres
			  
			    console.log(data)
			    $scope.all_similar_artist = data.data.data.similarartists.artist
			    $scope.all_similar = true
			    $scope.result = false
			    $scope.empty = false
			    $scope.history = false
			    $scope.searching_similar = false
			}

			function postsErrorFn(data, status, headers, config) {
			    console.log(data)
			}
		}
		$scope.back  = function(){
			$scope.all_similar = false
		    $scope.result = true
		}
		$scope.history_search = function(text){
			console.log(text)
			$timeout(function(){
                $rootScope.submitSearch(text)
            }, 100)
			
		}

	}
})();