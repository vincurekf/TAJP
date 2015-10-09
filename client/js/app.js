
// declare modules 
var app = angular.module('TAJPapp', [
  'angular-jwt',
  'ngRoute',
  'ngCookies',
  'TAJPapp.controllers',
  'TAJPapp.tokenService'
]);

app.run(['$rootScope', '$location', '$http', 'jwtHelper', function ($rootScope, $location, $http, jwtHelper) {
  /*
   * Settings
   */
  $rootScope.globals = {};
  $rootScope.globals.serverUrl = 'http://localhost/tajp/server';
  $rootScope.globals.token = window.localStorage['jwt_token'] || {};
  //
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
    var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
    var keeplogged = window.localStorage['keeplogged'] === 1 ? true : false;
    // redirect to login page if not logged in
    if ( ($location.path() !== '/login' && !window.localStorage['jwt_token']) || isExpired ) {
      if( keeplogged ){
        console.log('logging from brains')
        var username = window.localStorage['username'];
        var password = window.localStorage['password'];
        $rootScope.login( username, password, true );
        $location.path( next );
      }else{
        $location.path('/login');
      }
    }
  });
}]);
  
app.config(['$routeProvider', '$httpProvider', 'jwtInterceptorProvider', 
function ( $routeProvider, $httpProvider, jwtInterceptorProvider ) {
  jwtInterceptorProvider.tokenGetter = function() {
    return window.localStorage['jwt_token'];
  }; $httpProvider.interceptors.push('jwtInterceptor');

  $routeProvider
  .when('/login', {
    controller: 'LoginController',
    templateUrl: 'views/login.html'
  })
  .when('/', {
    controller: 'HomeController',
    templateUrl: 'views/home.html'
  })
  .otherwise({ redirectTo: '/login' });
  //
}]);