// declare modules 
var app = angular.module('TAJPapp.tokenService', [
  'angular-jwt',
  'ngRoute',
  'ngCookies'
]);

app.factory('loginService',
['Base64', '$http', '$rootScope', 
function ($http, $rootScope) {
  var service = {};
  return service;
}]);