
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
   * Global login function
   */
  $rootScope.login = function ( credentials, stay, callback ) {
    username = credentials.username;
    password = CryptoJS.SHA512(credentials.password).toString();
    console.log( username, password );
    $rootScope.dataLoading = true;
    tokenService.Login(username, password, function(response) {
      if(response.success) {
        tokenService.set(response.token);
        if( credentials.keeplogged ){
          window.localStorage['keeplogged'] = 1;
          window.localStorage['username'] = username;
          window.localStorage['password'] = CryptoJS.SHA512(password).toString();
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
   * Global logout function
   * logout user and redirect to /login page
   */
  $rootScope.logout = function () {
    tokenService.clear();
    $rootScope.globals.token = {};
    window.localStorage['jwt_token'] = '';
    window.localStorage['keeplogged'] = 0;
    window.localStorage['username'] = '';
    window.localStorage['password'] = '';
    $location.path('/login');
  };
  /*
   * Check validity or existence of token
   */
  $rootScope.checkToken = function(){
    // Check if the token is empty
    var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
    // or if is expired
    var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
    // and redirect
    if( isExpired ){
      tokenService.clear();
    }else{
      $location.path('/');
    }
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
    var isEmpty = Object.keys( $rootScope.globals.token ).length === 0 ? true : false;
    var isExpired = !isEmpty ? jwtHelper.isTokenExpired( $rootScope.globals.token ) : false;
    var keeplogged = parseInt( window.localStorage['keeplogged'] ) === 1 ? true : false;
    // redirect to login page if not logged in
    if ( ($location.path() !== '/login' && $location.path() !== '/register' && !window.localStorage['jwt_token']) || isExpired ) {
      if( keeplogged ){
        var credentials = {
          username: window.localStorage['username'],
          password: window.localStorage['password']
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

}]);
  
app.config(['$routeProvider', '$httpProvider', 'jwtInterceptorProvider', 
function ( $routeProvider, $httpProvider, jwtInterceptorProvider ) {
  
  // hook into $httpProvider and add token to all requests
  jwtInterceptorProvider.tokenGetter = function() {
    return window.localStorage['jwt_token'];
  }; $httpProvider.interceptors.push('jwtInterceptor');
  // update token after every request
  var updateToken = function ($q, $location) {
    return {
      response: function (result) {
        //hide your loading message
        if(result.data.token){
          window.localStorage['jwt_token'] = result.data.token;
        }
        return result;
      }
    }
  };
  $httpProvider.interceptors.push(updateToken);

  // set routes
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