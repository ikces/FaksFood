angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, $ionicScrollDelegate, filterFilter, Restavracije) {
	var data = null;
    var ind = 0
    $scope.buffer = [];

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
   

.controller('zemljevidCtrl', function($scope, NgMap) {
    NgMap.getMap().then(function(map) {
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });


})
   
.controller('profilCtrl', function($scope) {
	
})
   
.controller('restavracijaCtrl', function($scope) {

})
   
.controller('meniCtrl', function($scope) {

})
   
.controller('komentarjiCtrl', function($scope) {

})
   
.controller('oceneCtrl', function($scope) {

})
.controller('headerCtrl', function($scope, $cordovaToast, $http, Version, Restavracije){
    $scope.refresh=function(){
        $http({
          method: 'GET',
          url: 'http://faksfood2-ikces.rhcloud.com/restavracije/version'})
        .then(function successCallback(response) {
            var update = false;
            var onlineVersion = response.data.version;
            Version.get().then(function(data){
                if(data.length == 0){
                    Version.add(onlineVersion);
                    update = true;
                }
                else{
                    if(data.version != onlineVersion){
                        update = true;
                    }
                }
                if(update == true){
                    console.log('database is updating');
                    $cordovaToast.show('Database is updating', 'long', 'center');
                    Restavracije.getFromApiRestavracije();
                }
                else{
                    console.log("current version")
                    $cordovaToast.show('Current version', 'medium', 'center');
                }
            });
        }, function errorCallback(response) {
          return "Cannot connect to faksfood API";
        });
    }
})