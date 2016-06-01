angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {

})

.controller('signupCtrl', function($scope, $ionicHistory, UporabnikPrijavlen) {
    $scope.$on("$ionicView.beforeEnter", function(event, viewData) {
        viewData.enableBack = true;
    });

    $scope.register = function(user, ponoviGeslo) {
        if (user.password != ponoviGeslo) {
            $scope.showToast("Gesla se ne ujemata");
        } else {
            UporabnikPrijavlen.registerUser(user).then(function(getdata) {
                if (getdata != true) {
                    $scope.showToast("Uporabnik ze obstaja");
                } else {
                    $ionicHistory.goBack();
                }
            })
        }
    }

    $scope.showToast = function(msg) {
        if (window.plugins && window.plugins.toast) {
            $cordovaToast.show(msg, 'long', 'center');
        } else {
            alert(msg);
        }
    };
})

.controller('restavracijeCtrl', function($scope, $ionicScrollDelegate, filterFilter, Restavracije, CurrentRestavracija, UpdateRestavracije) {
    var data = null;
    var prikaziVse = 0;
    var ind = 0
    $scope.buffer = [];
    $scope.selectedKraj = null;

    Restavracije.getKraji().then(function(getdata) {
        $scope.kraji = getdata;
    });

    $scope.$watch(function() {
            return UpdateRestavracije.getVersion();
        },
        function(value) {
            Restavracije.getRestavracije().then(function(getdata) {
                console.log("SAFDASF")
                data = getdata;
                $scope.buffer = angular.copy(getdata);
                $scope.restavracije = getdata.slice(0, 10)
            });
        }
    );
    $scope.typed = function(searchText) {
        $scope.buffer = filterFilter(data, searchText);
    }

    $scope.$watch('buffer', function() {
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

    $scope.selectKraj = function() {

        if ($scope.selectedKraj != null)
            Restavracije.getRestavracije({ 'kraj_id': $scope.selectedKraj.id }).then(function(getdata) {
                data = getdata;
                $scope.buffer = angular.copy(getdata);
                $scope.restavracije = getdata.slice(0, 10)
            });
        else
            Restavracije.getRestavracije().then(function(getdata) {
                data = getdata;
                $scope.buffer = angular.copy(getdata);
                $scope.restavracije = getdata.slice(0, 10)
            });

    }

    $scope.clickRestavracija = function(current) {
        CurrentRestavracija.setCurrent(current);
    }

})


.controller('zemljevidCtrl', function($scope, NgMap, $cordovaGeolocation, Restavracije, CurrentRestavracija) {

    $scope.customIconCourent = {
        "scaledSize": [40, 40],
        "url": "http://bintangraya.com/assets/back/dist/css/ionicons/png/512/android-location.png"
    };

    //Pridobi podatke o restavracijah
    Restavracije.getRestavracije().then(function(getdata) {
        $scope.array = getdata;
    });
    //pridobitev trenutne lokacije
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
            $scope.lat = position.coords.latitude;
            $scope.long = position.coords.longitude;

        }, function(err) {
            // error
        });
    //prikaz zemljevida
    NgMap.getMap({ id: 'map' }).then(function(map) {
        $scope.map = map;
    });

    //prikaz infowindow okvirčka z podrobnostmi
    $scope.showRestavrant = function(event, restavrant) {
        CurrentRestavracija.setCurrent(restavrant);
        $scope.restavrant = restavrant;
        $scope.dist = $scope.distance($scope.lat, $scope.long, restavrant.sirina, restavrant.dolzina);
        $scope.map.showInfoWindow('myInfoWindow', this);
    };

    //izračun razdalje med dvena geolokacijama
    $scope.distance = function(lat1, lon1, lat2, lon2) {
        var R = 6371e3; // metres
        var rad = 0.0174532925199433;
        var φ1 = lat1 * rad;
        var φ2 = lat2 * rad;
        var Δφ = (lat2 - lat1) * rad;
        var Δλ = (lon2 - lon1) * rad;

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = R * c;
        d = Math.round(d * 100) / 100
        d = +d.toFixed(0);


        if (d > 1000) {
            d = d / 1000;
            d = Math.round(d * 100) / 100
            d = +d.toFixed(0)
            var ret = d + "km";
        } else

        {
            var ret = d + "m";
        }

        return ret;

    };

    $scope.clickRestavracija = function(current) {
        CurrentRestavracija.setCurrent(current);
    }


})

.controller('profilCtrl', function($scope, UporabnikPrijavlen) {
    $scope.user = null;

    UporabnikPrijavlen.getUser();

    $scope.$watch(function() {
        return UporabnikPrijavlen.getCurrentUser()
    }, function(getdata) {
        $scope.user = getdata;
    });

    $scope.logout = function() {
        UporabnikPrijavlen.removeUser();
    }
    $scope.login = function(username, password) {
        UporabnikPrijavlen.loginUser(username, password);
    }
})

.controller('restavracijaCtrl', function($scope, CurrentRestavracija, NgMap, Restavracije, $cordovaGeolocation) {

    //force show back button
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
    });
    $scope.customIconCourent = {
        "scaledSize": [40, 40],
        "url": "http://bintangraya.com/assets/back/dist/css/ionicons/png/512/android-location.png"
    };

    //Grega1
    $scope.delovnicasi = null;

    $scope.showMap = false;




    $scope.$watch(function() {
        return CurrentRestavracija.getCurrent()
    }, function() {

        $scope.showMap = true;
        $scope.restavracija = CurrentRestavracija.getCurrent();

        console.log($scope.restavracija);




        //pridobitev trenutne lokacije
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                $scope.latCourent = position.coords.latitude;
                $scope.longCourent = position.coords.longitude;

            }, function(err) {
                // error
            });
        //prikaži mapo
        NgMap.getMap({ id: 'map2' }).then(function(map2) {
            $scope.map2 = map2;
            $scope.lat = $scope.restavracija.sirina;
            $scope.long = $scope.restavracija.dolzina;
        });

        Restavracije.getDelovneCase($scope.restavracija.id).then(function(getdata) {
            $scope.delovnicasi = getdata;
            angular.forEach(getdata, function(value, key) {
                if (value.tip == 0) {
                    this[key].tip_s = "Pon-Pet"
                } else if (value.tip == 1) {
                    this[key].tip_s = "Sobota"
                } else {
                    this[key].tip_s = "Nedelja"
                }
            }, $scope.delovnicasi);
        });
    })

})

.controller('meniCtrl', function($scope, CurrentRestavracija, Restavracije) {
    $scope.restavracija = CurrentRestavracija.getCurrent();
    Restavracije.getMenije($scope.restavracija.id).then(function(data) {
        var newData = [];
        angular.forEach(data, function(value, key) {
            this.push(JSON.parse(value.jedi));

        }, newData);
        $scope.jedi = newData;

    });
})


.controller('headerCtrl', function($scope, $cordovaToast, $http, Version, Restavracije, UpdateRestavracije, UporabnikPrijavlen) {
    $scope.refreshDatabase = function() {
        $http({
                method: 'GET',
                url: 'http://faksfood2-ikces.rhcloud.com/restavracije/version'
            })
            .then(function successCallback(response) {
                var update = false;
                var onlineVersion = Date.now().toString(); //response.data[0].version;
                Version.get().then(function(data) {
                    if (data.length == 0) {
                        Version.add(onlineVersion);
                        update = true;
                    } else {
                        if (data.version != onlineVersion) {
                            update = true;
                        }
                    }
                    if (update == true) {
                        $scope.showToast("Baza se posodablja");
                        Restavracije.getFromApiRestavracije(onlineVersion);
                        //UpdateRestavracije.setVersion(onlineVersion);
                    } else {
                        $scope.showToast("Trenutna verzija");
                    }
                });
            }, function errorCallback(response) {
                return "Cannot connect to faksfood API";
            });
    }

    UporabnikPrijavlen.getUser();

    $scope.showToast = function(msg) {
        if (window.plugins && window.plugins.toast) {
            $cordovaToast.show(msg, 'long', 'center');
        } else {
            alert(msg);
        }
    };
})

.controller('komentarjiCtrl', function($scope, Ocene, CurrentRestavracija, Komentarji, UporabnikPrijavlen) {
    //force show back button
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
    });

    if (UporabnikPrijavlen.getCurrentUser() != null) {
        $scope.uprijava = true;

    } else {

        $scope.uprijava = false;
    }

    $scope.$watch(function() {
        return CurrentRestavracija.getCurrent();

    }, function() {
        $scope.restavracija = CurrentRestavracija.getCurrent();


        Ocene.getOceneByRestavracija($scope.restavracija.guid).then(function(ocene) {
            var povprecna = 0;
            if (ocene.length == 0) {
                $scope.povpr = 0;
            } else {
                for (var i = 0; i < ocene.length; i++) {
                    povprecna = povprecna + ocene[i].ocena;
                }
                $scope.povpr = (povprecna / ocene.length)
            }
        });

        $scope.getKomentarje();

    });

    $scope.getKomentarje = function() {
        $scope.komentarjiPrikazani = [];
        Komentarji.getKomentarjiByRestavracija($scope.restavracija.guid).then(function(koment) {

            if (koment.length == 0) {
                $scope.komentarjiPrikazani.push({ vsebina: "Trenutno ni komentarjev za to restavracijo" });
            } else {
                $scope.komentarjiPrikazani = koment;
            }

        });

    }

    $scope.oceni = function(ocena) {

        Ocene.addOcena(ocena, $scope.restavracija.guid, UporabnikPrijavlen.getCurrentUser().id);

        if ($scope.povpr != 0) {
            var tmp = parseInt($scope.povpr, 10);
            tmp = parseInt(tmp, 10) + parseInt(ocena, 10);
            $scope.povpr = parseInt(tmp, 10) / 2;
        } else {
            $scope.povpr = ocena;
        }
    }

    $scope.komentiraj = function(komentar) {
        Komentarji.addKomentar(komentar, $scope.restavracija.guid, UporabnikPrijavlen.getCurrentUser().id).then(function() {
            $scope.getKomentarje();
        });
    }

})

.controller('oceneCtrl', function($scope) {

})

.controller('profilKomentarjiCtrl', function($scope, Komentarji, UporabnikPrijavlen, Restavracije, $ionicPopup) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
    });

    $scope.komentarji = [];

    UporabnikPrijavlen.getCurrentUser(function(data) {
        $scope.komentarji = [];
        Komentarji.getKomentarjiByUser(data.id).then(function(getkoment) {
            angular.forEach(getkoment, function(value, key) {
                Restavracije.getRestavracijaById(value.restavracije_id).then(function(getrest) {
                    $scope.komentarji.push({
                        vsebina: value.vsebina,
                        id: value.id,
                        naziv: getrest.naziv
                    });
                })
            })
        })
    })

    $scope.removeKomentar = function(koment, index, koments) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Izbriši komentar',
            template: 'Ali si prepričan da želiš izbrisati komentar?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                Komentarji.removeKomentar(koment).then(function(get) {
                    koments.splice(index, 1);
                });
            }
        });
    }

    $scope.showConfirm = function() {

    };
})

.controller('profilOceneCtrl', function($scope, Ocene, UporabnikPrijavlen, Restavracije) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = true;
    });

    $scope.ocene = [];

    UporabnikPrijavlen.getCurrentUser(function(data) {
        $scope.ocene = [];
        Ocene.getOceneByUser(data.id).then(function(getocene) {
            angular.forEach(getocene, function(value, key) {
                Restavracije.getRestavracijaById(value.restavracije_id).then(function(getrest) {
                    $scope.ocene.push({
                        ocena: value.ocena,
                        id: value.id,
                        naziv: getrest.naziv
                    });
                })
            })
        })
    })
})
