// declare modules 
var app = angular.module('TAJPapp.controllers', [
  'angular-jwt',
  'ngRoute',
  'ngCookies'
]);

app.controller('LoginController', 
['$scope', '$rootScope', '$location', 'tokenService', 'jwtHelper', 
function ($scope, $rootScope, $location, tokenService, jwtHelper) {
  // reset login status
  var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
  var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
  if( isExpired ){
    tokenService.clear();  
  }else{
    $location.path('/');
  }

  $rootScope.login = function ( username, password, stay ) {
    username = username || $scope.username;
    password = password || $scope.password;
    $scope.dataLoading = true;
    tokenService.Login(username, password, function(response) {
      if(response.success) {
        tokenService.set(response.token);
        if( $scope.keeplogged ){
          window.localStorage['keeplogged'] = 1;
          window.localStorage['username'] = username;
          window.localStorage['password'] = password;
        };
        if( !stay ){
        	console.log( 'stay' );	
          $location.path('/');
        }
      } else {
        $scope.error = response.error;
        $scope.dataLoading = false;
      }
    });
  };
}]);

app.controller('HomeController', 
['$scope', '$rootScope', '$location', 'tokenService', '$http',  
function ( $scope, $rootScope, $location, tokenService, $http ) {
  //
  $scope.logout = function () {
    tokenService.clear();
    $rootScope.globals.token = {};
    window.localStorage['jwt_token'] = '';
    window.localStorage['keeplogged'] = 0;
    window.localStorage['username'] = '';
    window.localStorage['password'] = '';

    $location.path('/login');
  };
  // get all users via api
  $http.get( $rootScope.globals.serverUrl+'/api/users' )
  .success(function (response) {
    $scope.users = response;
    console.log( response );
  });
}]);