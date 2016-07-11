
(function () {
    'use strict';

    angular
        .module('lastfm.fmadmin.controllers')
        .controller('FmAdminController', FmAdminController);

    FmAdminController.$inject = ['$scope', '$rootScope', '$cookies', '$timeout', 'Analytics',];

    function FmAdminController($scope, $rootScope, $cookies, $timeout, Analytics) {
		$scope.admin_loggedin = false
		// console.log('asdsa')
		$scope.submitAdminLogin = function(){
			// console.log('asdsa')
			Analytics.login($scope.admin).then(postsSuccessFn, postsErrorFn);

			function postsSuccessFn(data, status, headers, config) {
			  if (data.status == 200) {
			  	$cookies.put('session_id', data.data.data.session_id);
			  	$scope.admin_loggedin = true
			  	Analytics.get().then(getSuccessFn, getErrorFn);

			  	function getSuccessFn(data, status, headers, config) {
			  	  if (data.status == 200) {
			  	  	// console.log(data)
			  	  	$scope.top_data = data.data.data
			  	  	console.log($scope.top_data)

			  	  }
			  	 
			  	 
			  	}

			  	function getErrorFn(data, status, headers, config) {
			  	  // Snackbar.error(data.error);
			  	  console.log(data)
			  	  alert('Credentials are not correct. Please use a valid username and password.')
			  	}

			  }
			 
			 
			}

			function postsErrorFn(data, status, headers, config) {
			  // Snackbar.error(data.error);
			  console.log(data)
			  alert('Credentials are not correct. Please use a valid username and password.')
			}
		}
		$scope.logout = function(){
			console.log('sadas')
			$cookies.remove('session_id')
			$scope.admin_loggedin = false
		}

	}
})();