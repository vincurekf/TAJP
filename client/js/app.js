
// declare modules 
var app = angular.module('TAJPapp', [
  'angular-jwt',
  'ngRoute',
  'ngCookies',
  'TAJPapp.controllers',
  'TAJPapp.tokenService'
]);

app.run(['$rootScope', '$location', '$http', 'jwtHelper', 'tokenService', function ($rootScope, $location, $http, jwtHelper, tokenService) {
  /*
   * Settings
   */
  $rootScope.globals = {
    serverUrl: 'http://localhost/tajp/server',
    token: window.localStorage['jwt_token'] || {}
  }

  /*
   * Login function
   */
  $rootScope.login = function ( credentials, stay, callback ) {
    console.log( credentials );
    username = credentials.username;
    password = credentials.password;
    $rootScope.dataLoading = true;
    tokenService.Login(username, password, function(response) {
      if(response.success) {
        tokenService.set(response.token);
        if( credentials.keeplogged ){
          window.localStorage['keeplogged'] = 1;
          window.localStorage['username'] = username;
          window.localStorage['password'] = password;
        };
        if( !stay ){
          console.log( 'stay' );  
          $location.path('/');
        }
        if( callback ){
          callback();
        }
      } else {
        $rootScope.error = response.error;
        $rootScope.dataLoading = false;
      }
    });
  };

  /*
   * listen for redirecting (changing paths/views)
   * and check if there is valit token
   * if not, check keeplogged variable -> log user again 
   * otherwise redirect to /login
   */
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    // Keep track of which location the user was about to move to.
    var targetPath = $location.path();
    var targetSearch = $location.search();
    var targetHash = $location.hash();
    console.log( targetPath );
    var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
    var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
    var keeplogged = parseInt( window.localStorage['keeplogged'] ) === 1 ? true : false;
    console.log( keeplogged );
    // redirect to login page if not logged in
    if ( ($location.path() !== '/login' && !window.localStorage['jwt_token']) || isExpired ) {
      if( keeplogged ){
        var credentials = {
          username: window.localStorage['username'],
          password: window.localStorage['password'],
          keeplogged: window.localStorage['keeplogged']
        }
        console.log('login from brains')
        $rootScope.login( credentials, true, function(){
          console.log('EH?');
          $location.path( '/login' );
        });
      }else{
        $location.path('/login');
      }
    }
  });
  //
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
  .when('/register', {
    controller: 'RegisterController',
    templateUrl: 'views/register.html'
  })
  .when('/', {
    controller: 'HomeController',
    templateUrl: 'views/home.html'
  })
  .otherwise({ redirectTo: '/' });
  //
}]);