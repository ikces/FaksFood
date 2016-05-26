angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, $ionicScrollDelegate, filterFilter, Restavracije) {
	var data = null;
    var ind = 0

    Restavracije.getRestavracije().then(function(getdata){
		data = getdata;
        $scope.buffer = angular.copy(getdata);
        $scope.restavracije = getdata.slice(0, 10)
	});
    $scope.typed = function(searchText){
        $scope.buffer = filterFilter(data, searchText);
    }

    $scope.$watch('buffer', function(){
        ind = 0
        $scope.restavracije = $scope.buffer.slice(0, 10);
        $ionicScrollDelegate.scrollTop();
    })
    $scope.loadMore = function() {
        ind = ind + 10
        var r = 10
        if (ind + 10 >= $scope.buffer.length) {
            r = $scope.buffer.length - ind
        }
        $scope.restavracije = $scope.restavracije.concat($scope.buffer.slice(ind, r + ind));
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
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
   
.controller('profilCtrl', function($scope, Restavracije) {
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

.controller('headerCtrl', function($scope){
    $scope.refresh=function(){
        
    }
})
 