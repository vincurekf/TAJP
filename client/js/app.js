
// declare modules 
angular.module('BasicHttpAuthExample', [
  'angular-jwt',
  'ngRoute',
  'ngCookies'
])

.run(['$rootScope', '$location', '$http', 'jwtHelper', function ($rootScope, $location, $http, jwtHelper) {
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
    // redirect to login page if not logged in
    if ( ($location.path() !== '/login' && !window.localStorage['jwt_token']) || isExpired ) {
      $location.path('/login');
    }
  });
}])
  
.config(['$routeProvider', '$httpProvider', 'jwtInterceptorProvider', 
function ( $routeProvider, $httpProvider, jwtInterceptorProvider ) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = function() {
    return window.localStorage['jwt_token'];
  };
  $httpProvider.interceptors.push('jwtInterceptor');

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
}])

.controller('LoginController', 
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

  $scope.login = function () {
    $scope.dataLoading = true;
    tokenService.Login($scope.username, $scope.password, function(response) {
      if(response.success) {
        tokenService.set(response.token);
        $location.path('/');
      } else {
        $scope.error = response.error;
        $scope.dataLoading = false;
      }
    });
  };

}])

.controller('HomeController', 
['$scope', '$rootScope', '$location', 'tokenService', '$http',  
function ( $scope, $rootScope, $location, tokenService, $http ) {
  //
  $scope.logout = function () {
    tokenService.clear()
    $location.path('/login');
  };
  // get all users via api
  $http.get( $rootScope.globals.serverUrl+'/api/users' )
  .success(function (response) {
    $scope.users = response;
    console.log( response );
  });
}])

.factory('tokenService',
['Base64', '$http', '$rootScope', '$timeout', 
function (Base64, $http, $rootScope, $timeout) {
  var service = {};
  service.Login = function (username, password, callback) {
    $http.post( $rootScope.globals.serverUrl+'/login', { user_name: username, password: password } )
    .success(function (response) {
      callback(response);
    });
  };
  service.set = function (token) {
    $rootScope.globals.token = token;
    window.localStorage['jwt_token'] = token;
  };
  service.clear = function () {
    $rootScope.globals.token = {};
    window.localStorage['jwt_token'] = '';
  };
  return service;
}])

.factory('Base64', function () {
  /* jshint ignore:start */
  
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;
  
      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
  
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
  
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
  
        output = output +
          keyStr.charAt(enc1) +
          keyStr.charAt(enc2) +
          keyStr.charAt(enc3) +
          keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);
  
      return output;
    },
  
    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;
  
      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
          "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
          "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
  
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
  
        output = output + String.fromCharCode(chr1);
  
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
  
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
  
      } while (i < input.length);
  
      return output;
    }
  };
  
  /* jshint ignore:end */
});