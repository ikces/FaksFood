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
/*.controller('restavracijeCtrl', function($scope, filterFilter, Restavracije) {
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
>>>>>>> b06bb0e3a097d87ff3f185a426b38484ccd68d3c*/
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
})
   
.controller('zemljevidCtrl', function($scope) {


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