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
   

.controller('zemljevidCtrl', function($scope, NgMap, $cordovaGeolocation, Restavracije,CurrentRestavracija) {

    //Pridobi podatke o restavracijah
    Restavracije.getRestavracije().then(function(getdata){    
        $scope.array=getdata; 
    });
    //pridobitev trenutne lokacije
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      $scope.lat  = position.coords.latitude;
      $scope.long = position.coords.longitude;

    }, function(err) {
      // error
    });
    //prikaz zemljevida
    NgMap.getMap({id:'map'}).then(function(map) {
    $scope.map = map;
    }); 

    //prikaz infowindow okvirčka z podrobnostmi
    $scope.showRestavrant = function(event, restavrant) {
        console.log(restavrant, "SHOW");
        CurrentRestavracija.setCurrent(restavrant);
        $scope.restavrant = restavrant;
        $scope.dist = $scope.distance($scope.lat, $scope.long, restavrant.sirina, restavrant.dolzina);
        $scope.map.showInfoWindow('myInfoWindow', this);
      };

    //izračun razdalje med dvena geolokacijama
    $scope.distance = function(lat1, lon1, lat2, lon2){
        var R = 6371e3; // metres
        var rad = 0.0174532925199433;
        var φ1 = lat1*rad;
        var φ2 = lat2*rad;
        var Δφ = (lat2-lat1)*rad;
        var Δλ = (lon2-lon1)*rad;

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = R * c;
           d =  Math.round(d * 100) / 100
           d = +d.toFixed(0);


           if(d > 1000)
           {
            d = d/1000;
            d =  Math.round(d * 100) / 100
           d = +d.toFixed(0)
            var ret = d +"km";
           }else

           {
            var ret = d + "m";
           }

           return ret;

    };

     $scope.clickRestavracija=function(current){
        CurrentRestavracija.setCurrent(current);
    }


})
   
.controller('profilCtrl', function($scope) {
	
})

.controller('restavracijaCtrl', function($scope, CurrentRestavracija, NgMap) {
    $scope.$watch(function(){ return CurrentRestavracija.getCurrent()}, function(){
        $scope.restavracija = CurrentRestavracija.getCurrent();
    })
 

    //prikaz zemljevida
    NgMap.getMap({id:'map'}).then(function(map) {
    $scope.map = map;
    $scope.lat= $scope.restavracija.sirina;
    $scope.long = $scope.restavracija.dolzina;
    }); 
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


