
(function () {
    'use strict';

    angular
        .module('lastfm.layout.controllers')
        .controller('LayoutController', LayoutController);

    LayoutController.$inject = ['$scope', '$rootScope', '$cookies', '$timeout', 'Login', 'Search'];

    function LayoutController($scope, $rootScope, $cookies, $timeout, Login, Search) {
		$scope.signup=false
		$scope.user = {}
		var session_id = $cookies.get('session_id')
		if (session_id == null){
			$rootScope.loggedin = false
		}
		else{
			$rootScope.loggedin = true
			$rootScope.current_username = $cookies.get('username')
		}
		$scope.searching=false
		$rootScope.template = '/lastfm_static/frontend/templates/artist.html'
	
		$scope.submitLogin = function(){
			Login.get($scope.user).then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  // $scope.genres = data.data;
			  // $scope.genre_list = $scope.genres
			  // console.log(data)
			  // console.log(data.status)

			  if (data.status == 200) {
			  	$cookies.put('session_id', data.data.data.session_id);
			  	$rootScope.loggedin = true
			  	$cookies.put('username', data.data.data.username);
			  	$rootScope.current_username = data.data.data.username
			  }
			 
			 
			}

			function postsErrorFn(data, status, headers, config) {
			  // Snackbar.error(data.error);
			  console.log(data)
			  alert('User does not exist. Please use a valid username.')
			}
		}
		$scope.logout = function(){
			$cookies.remove('session_id')
			$rootScope.loggedin = false
			$cookies.remove('username')
		}
		$scope.submitSignup = function(){
			Login.create($scope.user).then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  // $scope.genres = data.data;
			  // $scope.genre_list = $scope.genres
			  console.log(data)
			  if (data.data.status == 'error'){
			  	alert('User already exists. Please use a different username.')
			  }
			  // console.log(data.status)
			  else if (data.status == 200){
			  	$cookies.put('session_id', data.data.data.session_id);
			  	$rootScope.loggedin = true
			  	$cookies.put('username', data.data.data.username);
			  	$rootScope.current_username = data.data.data.username
			  	
			  }
			  // console.log($cookies.get('session_id'))

			}

			function postsErrorFn(data, status, headers, config) {
			  // Snackbar.error(data.error);
			  console.log(data)
			}
		}
		$rootScope.submitSearch = function(text){
			// console.log(text)
			$scope.searching = true
			Search.post(text).then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  // $scope.genres = data.data;
			  // $scope.genre_list = $scope.genres
			  
			  $scope.searching = false
			  $scope.artist_data = data.data.data
			  $rootScope.$broadcast('parent', {'pass':'searchresult', 'result':$scope.artist_data, 'searchkey':text})
			  // console.log($rootScope.artist_data)
			  
			  // console.log($cookies.get('session_id'))

			}

			function postsErrorFn(data, status, headers, config) {
			  // Snackbar.error(data.error);
			  $scope.searching = false
			  $rootScope.$broadcast('parent', {'pass':'notfound', 'searchkey':text})
			}

		}
		$scope.searchHistory = function(){
			Search.get().then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  // $scope.genres = data.data;
			  // $scope.genre_list = $scope.genres
			  	data = data.data.data
			  	$rootScope.$broadcast('parent', {'pass':'history', 'data':data})
			    // console.log(data)

			}

			function postsErrorFn(data, status, headers, config) {
			  // Snackbar.error(data.error);
			 	console.log(data)
			}
		}

	}
})();