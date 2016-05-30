angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, $ionicScrollDelegate, filterFilter, Restavracije, CurrentRestavracija, UpdateRestavracije) {
	var data = null;
    var prikaziVse = 0;
    var ind = 0
    $scope.buffer = [];

    Restavracije.getKraji().then(function(getdata){
        $scope.kraji = getdata;
        console.log(getdata)

    });
    
    $scope.$watch(function () { return UpdateRestavracije.getVersion(); },
         function (value) {
            console.log(value)
             Restavracije.getRestavracije().then(function(getdata){
                data = getdata;
                $scope.buffer = angular.copy(getdata);
                $scope.restavracije = getdata.slice(0, 10)
            });
         }
      );
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

    $scope.clickRestavracija=function(current){
        CurrentRestavracija.setCurrent(current);
    }

    $scope.selectKraj = function(clicked){

    }
})
   

.controller('zemljevidCtrl', function($scope, NgMap, $cordovaGeolocation, Restavracije) {
    //pridobitev trenutne lokacije


//Pridobi podatke o restavracijah
    Restavracije.getRestavracije().then(function(getdata){    
        $scope.array=getdata; 
    });

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.lat  = position.coords.latitude;
      $scope.long = position.coords.longitude;

    }, function(err) {
      // error
    });



$scope.showData = function(event, marker) {
        console.log('clicked pin!');
        //HOW CAN I GET THE MARKER OBJECT (The one that was clicked) HERE?
        console.log('id_restavracije ->', marker); //prints undefined
      };

  //watch.clearWatch();
        //Prikaz zemljevida 
        NgMap.getMap().then(function(map) {
                    console.log("zemljevd test");
                    console.log(map.getCenter());
                    console.log('markers', map.markers);
                    console.log('shapes', map.shapes);
                    $scope.map = map;
                });
   




 $scope.clickFn = function(id){
    $scope.info = id;
    console.log(id)
 }



})
   
.controller('profilCtrl', function($scope) {
	
})
   
.controller('restavracijaCtrl', function($scope, CurrentRestavracija) {
    //$scope.restavracija = CurrentRestavracija.getCurrent();
    $scope.$watch(CurrentRestavracija.getCurrent(), function(){
        $scope.restavracija = CurrentRestavracija.getCurrent();
    })
})
   
.controller('meniCtrl', function($scope, CurrentRestavracija,Restavracije) {
    $scope.restavracija = CurrentRestavracija.getCurrent();
    Restavracije.getMenije($scope.restavracija.id).then(function(data){
        var newData = [];
        angular.forEach(data, function(value, key){
            this.push(JSON.parse(value.jedi));

        }, newData);
        $scope.jedi = newData;

    });
})
   
.controller('komentarjiCtrl', function($scope) {

})
   
.controller('oceneCtrl', function($scope) {

})
.controller('headerCtrl', function($scope, $cordovaToast, $http, Version, Restavracije, UpdateRestavracije){
    $scope.refreshDatabase=function(){
        $http({
          method: 'GET',
          url: 'http://faksfood2-ikces.rhcloud.com/restavracije/version'})
        .then(function successCallback(response) {
            var update = false;
            var onlineVersion = /*Date.now().toString();*/response.data[0].version;
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
                    $scope.showToast("Baza se posodablja");
                    Version.update(onlineVersion);
                    Restavracije.getFromApiRestavracije();
                    UpdateRestavracije.setVersion(onlineVersion);
                }
                else{
                    $scope.showToast("Trenutna verzija");
                }
            });
        }, function errorCallback(response) {
          return "Cannot connect to faksfood API";
        });
    }

    $scope.showToast = function(msg) {
        if (window.plugins && window.plugins.toast) {
            $cordovaToast.show(msg, 'long', 'center');
        } else {
            alert(msg);
        }
    };
})


