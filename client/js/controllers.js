// declare modules 
var app = angular.module('TAJPapp.controllers', [
  'angular-jwt',
  'ngRoute',
  'ngCookies'
]);

app.controller('LoginController', 
['$scope', '$rootScope', '$location', 'tokenService', 'jwtHelper', 
function ($scope, $rootScope, $location, tokenService, jwtHelper) {
  $rootScope.checkToken();
  $rootScope.error = false;
}]);

app.controller('HomeController', 
['$scope', '$rootScope', '$location', 'tokenService', '$http',  
function ( $scope, $rootScope, $location, tokenService, $http ) {
  
  // get all users via api
  // token is added automatically
  $http.get( $rootScope.globals.serverUrl+'/api/users' )
  .success(function (response) {
    $scope.users = response.result;
    console.log( response.result );
  });

}]);

app.controller('RegisterController', 
['$scope', '$rootScope', '$location', 'tokenService', '$http',  
function ( $scope, $rootScope, $location, tokenService, $http ) {
  $rootScope.checkToken();
  $rootScope.error = false;
  $rootScope.success = false;
  $scope.register = function(){
    var newUser = angular.copy( $scope.newUser );
    // hash password before sending to server
    newUser.password = CryptoJS.SHA512(newUser.password).toString();    
    // send registration data to server
    $http.post( $rootScope.globals.serverUrl+'/register', newUser )
    .success(function (response) {
      console.log( response );
      if( response.success ){
        $rootScope.dataLoading = false;
        $rootScope.success = 'You have been registered.';
      }else{
        $rootScope.error = response.error;
        $rootScope.dataLoading = false;
      }
    });
  };
}]);