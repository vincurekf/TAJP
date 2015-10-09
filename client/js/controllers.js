// declare modules 
var app = angular.module('TAJPapp.controllers', [
  'angular-jwt',
  'ngRoute',
  'ngCookies'
]);

app.controller('LoginController', 
['$scope', '$rootScope', '$location', 'tokenService', 'jwtHelper', 
function ($scope, $rootScope, $location, tokenService, jwtHelper) {
  $rootScope.error = false;
  // reset login status
  var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
  var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
  if( isExpired ){
    tokenService.clear();  
  }else{
    $location.path('/');
  }
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

app.controller('RegisterController', 
['$scope', '$rootScope', '$location', 'tokenService', '$http',  
function ( $scope, $rootScope, $location, tokenService, $http ) {
  $rootScope.error = false;
  // get all users via api
  console.log('register');
  $scope.register = function(){
    $http.post( $rootScope.globals.serverUrl+'/register', $scope.newUser )
    .success(function (response) {
      console.log( response );
      if( response.success ){
        $rootScope.dataLoading = false;
      }else{
        $rootScope.error = response.error;
        $rootScope.dataLoading = false;
      }
    });

  };
}]);