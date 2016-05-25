angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, Restavracije) {
	console.log("asd");
	Restavracije.getRestavracije().then(function(data){
		console.log(data);
	});
	/*$scope.test=null;
	var object={
		id: 1,
		name: 'test'
	};
	Team.add(object);
	Team.get(1).then(function(team){
		console.log(team);
		$scope.test=team;
	});	*/
})
   
.controller('zemljevidCtrl', function($scope, $ionicLoading
	) {

	google.maps.event.addDomListener(window, 'load', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
    });

    
 // var div = document.getElementById("map_canvas");

 //      // Initialize the map view
 //      map = plugin.google.maps.Map.getMap(div);

 //      // Wait until the map is ready status.
 //      map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
 //    }, false);

 //    function onMapReady() {
 //      var button = document.getElementById("button");
 //      button.addEventListener("click", onBtnClicked, false);
 //    }

 //    function onBtnClicked() {
 //      map.showDialog();

})
   
.controller('profilCtrl', function($scope) {
	Restavracije.getFromApiRestavracije();
})
   
.controller('restavracijaCtrl', function($scope) {

})
   
.controller('meniCtrl', function($scope) {

})
   
.controller('komentarjiCtrl', function($scope) {

})
   
.controller('oceneCtrl', function($scope) {

})
 