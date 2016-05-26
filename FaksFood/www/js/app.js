// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova', 'ngMap'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("myapp.db",{location:'default'});
    } else {
      // Ionic serve syntax
      db = window.openDatabase("myapp.db", "1.0", "My app", -1);
    }

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS restavracije (id integer primary key, guid text, naziv text, telefon text, ulica text, kraj_id integer, vrednost_obroka text, sirina real, dolzina real)"); 
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS odpiralni_casi (id integer primary key, tip integer, cas_odpre text, cas_zapre text, restavracije_id integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS kraj (id integer primary key, naziv text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS vrste_ponudbe (id integer primary key, naziv text, icona text, restavracije_id integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS jedilniki (id integer primary key, jedi text, restavracije_id integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS version (id integer, version text)");
    
  });


}).config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center');
}]);



//google maps
var map;
    document.addEventListener("deviceready", function() {
      var div = document.getElementById("map_canvas");

      // Initialize the map view
      map = plugin.google.maps.Map.getMap(div);

      // Wait until the map is ready status.
      map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
    }, false);

    function onMapReady() {
      var button = document.getElementById("button");
      button.addEventListener("click", onBtnClicked, false);
       
    }

    function onBtnClicked() {
       
      map.showDialog();

    }