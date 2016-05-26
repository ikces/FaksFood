angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, filterFilter, Restavracije) {
	var data = null;
    var ind = 0

    Restavracije.getRestavracije().then(function(data){
		$scope.restavracije = data;
	});

    $scope.typed = function(searchText){
        $scope.buffer = filterFilter(data, searchText);
        console.log("ASD");
    }

    $scope.$watch('data', function(){
        console.log('data changed')
        ind = 0;
    })
	$scope.items = [];
    $scope.loadMore = function() {
        $http.get('/more-items').success(function(items) {
            useItems(items);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
})
   
.controller('zemljevidCtrl', function($scope) {

  

    
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
 