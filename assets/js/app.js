var exampleApp = angular.module('exampleApp', ['ngRoute']);


exampleApp.controller('AppCtrl', function ($scope, $rootScope) {
  console.log('AppCtrl')
  // simple ajax funkce, muzes klidne pouzit jQuery
  $rootScope.ajax = {
    post: function( url, akce, table, params, callback ){
      callback = typeof callback === "function" ? callback : params;
      // vytvorit XMLHttpRequest objekt
      var xhr = new XMLHttpRequest();
      // projít parametry a vytvorit string s udaji kterej se posle PHP funkci
      var vars = 'akce='+akce+'&tabulka='+table+'&';
      for( id in params ){
      // pro kazdej parametr pridat ke stringu "id=parametr&" 
        vars += id+'='+params[id]+'&'; 
      };
      console.log( url, vars );
      // připravit request
      xhr.open("POST", url, true);
      // nastavit content header aby se daly posilat parametry v requestu
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      // priradit funkci ktera se vola pri ready eventu - PHP vratilo vysledek
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
          // vsechno proběhlo ok (hlavicka je 200 = OK)
          // xhr.responsetext je to co ti to vratilo z PHP
          // JSON.parse() prevede PHP array na JSON string kterymu JS rozumi
          callback( JSON.parse( xhr.responseText ) );
        }
      };
      // zavolat samotnej request
      xhr.send( vars ); 
    },
    get: function( url, akce, table, params, callback ){
      callback = typeof callback === "function" ? callback : params;
      // vytvorit XMLHttpRequest objekt
      var xhr = new XMLHttpRequest();
      // projít parametry a vytvorit string s udaji kterej se posle PHP funkci
      var vars = 'akce='+akce+'&tabulka='+table+'&';
      for( id in params ){ 
      // pro kazdej parametr pridat ke stringu "id=parametr&" 
        vars += id+'='+params[id]+'&'; 
      };
      // připravit request
      xhr.open('GET', encodeURI(url+'?'+vars));
      // priradit funkci ktera se vola pri onload eventu - PHP vratilo vysledek
      xhr.onload = function() {
        if (xhr.status === 200) {
          // vsechno proběhlo ok (hlavicka je 200 = OK)
          // xhr.responsetext je to co ti to vratilo z PHP
          // JSON.parse() prevede PHP array na JSON string kterymu JS rozumi
          callback( JSON.parse( xhr.responseText ) );
        }else{
          // neco je spatne, vyhodi ti to v JS chybu
          callback( { error: xhr.status } );
        }
      };
      // zavolat samotnej request
      xhr.send();
    }
  };

  // kontejnery pro data
  $rootScope.completeData = {};
  // 'api/api.php' je povinna cesta k souboru
  // zbytek jsou promenny (to co u jQuery cpes jako parametry pro prenos)

  // nacist vsechna data z databaze
  $rootScope.fetchItems = function(){
    $rootScope.ajax.get('api/api.php', 'fetch', 'test', function( result ){
      console.log( result );
      $rootScope.completeData = result;
      // $apply() function should be called only after actions outside the $rootScope (http requests)
      $rootScope.$apply();
    });
  };
  $rootScope.fetchItems();


});

exampleApp.controller('HomeCtrl', function ($scope, $rootScope) {
  console.log('HomeCtrl');
  $scope.newItem = {};
  
  // vlozit data do databaze
  $scope.insertItem = function(newItem){
    console.log( newItem );
    $rootScope.ajax.post('api/api.php', 'insert', 'test', newItem, function( result ){
      if( !result.error ){
        newItem.id = result.id;
        $rootScope.completeData.push( newItem );
        $scope.newItem = {};
        $rootScope.$apply();
      }
      console.log( result );
    });
  }
  
  // aktualizovat data v databazi
  $scope.updateItem = function( item ){
    $rootScope.ajax.post('api/api.php', 'update', 'test', item, function( result ){
      console.log( result );
    });
  }
  
  // smazat data z databaze
  $scope.deleteItem = function( item ){
    var r = confirm("Delete item with ID: "+item.id+"!");
    if (r == true) {
      $rootScope.ajax.post('api/api.php', 'delete', 'test', { id: item.id }, function( result ){
        //alert('Deleted');
        // update the data on user side
        // using underscore.js
        console.log( item.id );
        var odds = _.reject($rootScope.completeData, function(value, key){ return value.id === item.id; });
        $rootScope.completeData = odds;
        $rootScope.$apply();
        
        console.log( result );
      });
    }
  }
});

exampleApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  //
}]);
