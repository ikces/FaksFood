angular.module('app.factorys', [])


.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
    var self = this;

    // Handle query's and potential errors
    self.query = function(query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function() {
            $cordovaSQLite.execute(db, query, parameters)
                .then(function(result) {
                    q.resolve(result);
                }, function(error) {
                    console.warn('I found an error');
                    console.warn(error);
                    q.reject(error);
                });
        });
        return q.promise;
    }

    // Proces a result set
    self.getAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    }

    // Proces a single result
    self.getById = function(result) {
        if (result.rows.length != 0) {
            var output = null;
            output = angular.copy(result.rows.item(0));
            return output;
        } else return [];
    }

    return self;
})


.factory('Restavracije', function($cordovaSQLite, DBA, $http, $cordovaToast, UpdateRestavracije) {
    var self = this;

    self.getFromApiRestavracije = function(version) {
        $http({
                method: 'GET',
                url: 'http://faksfood2-ikces.rhcloud.com/restavracije'
            })
            .then(function successCallback(response) {
                DBA.query("DELETE FROM restavracije");
                var sqlArr = [];
                var sqlString = "INSERT INTO restavracije(dolzina, `guid`, kraj_id, naziv, sirina, telefon, ulica, vrednost_obroka) VALUES";
                angular.forEach(response.data, function(value, key) {
                    sqlArr.push("('" + value.dolzina + "','" + value.guid + "', '" + value.kraj_id + "','" + value.naziv.replace(/'/g, "") + "'," +
                        "'" + value.sirina + "','" + value.telefon + "','" + value.ulica + "','" + value.vrednost_obroka + "')");
                });
                if (sqlArr.length != 0) {
                    sqlString += sqlArr.join();
                    DBA.query(sqlString).then(function(resp) {
                        self.getFromApiMenus();
                        UpdateRestavracije.setVersion(version);
                    }).catch(function(err) {
                        console.log(err);
                    });
                }
            }, function errorCallback(response) {
                return "Cannot connect to faksfood API";
            });
    }
    self.getFromApiMenus = function() {
        $http({
                method: 'GET',
                url: 'http://faksfood2-ikces.rhcloud.com/restavracije/jedi'
            })
            .then(function successCallback(response) {
                DBA.query("DELETE FROM jedilniki");
                var sqlArr = [];
                var sqlString = "INSERT INTO jedilniki(restavracije_id, jedi) VALUES";
                angular.forEach(response.data, function(value, key) {
                    sqlArr.push("('" + value.restavracije_id + "','" + value.jedi + "')");
                });
                if (sqlArr.length != 0) {
                    sqlString += sqlArr.join();
                    DBA.query(sqlString).then(function(resp) {
                        self.getFromApiKraji();
                    });
                }
            }, function errorCallback(response) {
                return "Cannot connect to faksfood API";
            });
    }

    self.getFromApiKraji = function() {
        $http({
                method: 'GET',
                url: 'http://faksfood2-ikces.rhcloud.com/restavracije/kraj'
            })
            .then(function successCallback(response) {
                DBA.query("DELETE FROM kraj");
                var sqlArr = [];
                var sqlString = "INSERT INTO kraj(id, naziv) VALUES";
                angular.forEach(response.data, function(value, key) {
                    sqlArr.push("('" + value.id + "','" + value.naziv + "')");
                });
                if (sqlArr.length != 0) {
                    sqlString += sqlArr.join();
                    DBA.query(sqlString).then(function(resp) {
                        self.getFromApiDelovniCasi();
                    });
                }
            }, function errorCallback(response) {
                return "Cannot connect to faksfood API";
            });
    }

    self.getFromApiDelovniCasi = function() {
        $http({
                method: 'GET',
                url: 'http://faksfood2-ikces.rhcloud.com/restavracije/odpiralnicasi'
            })
            .then(function successCallback(response) {
                DBA.query("DELETE FROM odpiralni_casi");
                var sqlArr = [];
                var sqlString = "INSERT INTO odpiralni_casi(id, tip, cas_odpre, cas_zapre, restavracije_id) VALUES";
                angular.forEach(response.data, function(value, key) {
                    sqlArr.push("('" + value.id + "','" + value.tip + "','" + value.cas_odpre + "','" + value.cas_zapre + "','" + value.restavracije_id + "')");
                });
                if (sqlArr.length != 0) {
                    sqlString += sqlArr.join();
                    DBA.query(sqlString).then(function(resp) {
                        self.showToast("Posodobljeno!");
                    });
                }
            }, function errorCallback(response) {
                return "Cannot connect to faksfood API";
            });
    }


    self.getRestavracije = function(filter) {
        var query = "SELECT r.*, k.naziv as kraj FROM restavracije r LEFT JOIN kraj k ON k.id = r.kraj_id";
        if (filter != null) {
            query += " WHERE r.kraj_id=" + filter.kraj_id;
        }
        return DBA.query(query)
            .then(function(result) {
                DBA.query("SELECT version FROM version WHERE id=1")
                    .then(function(version) {
                        self.currentVersion = DBA.getById(version);
                    });
                return DBA.getAll(result);
            });
    }

    self.getRestavracijaById = function(guid) {
        var query = "SELECT naziv FROM restavracije WHERE guid=" + guid;
        return DBA.query(query)
            .then(function(result) {
                return DBA.getById(result);
            });
    }

    self.getMenije = function(id) {

        return DBA.query("SELECT * FROM jedilniki WHERE restavracije_id=" + id)
            .then(function(result) {
                return DBA.getAll(result);
            });
    }
    self.getKraji = function(id) {
        return DBA.query("SELECT * FROM kraj")
            .then(function(result) {
                return DBA.getAll(result);
            });
    }
    self.getDelovneCase = function(id) {
        return DBA.query("SELECT * FROM odpiralni_casi WHERE restavracije_id=" + id)
            .then(function(result) {
                return DBA.getAll(result);
            });
    }

    self.showToast = function(msg) {
        if (window.plugins && window.plugins.toast) {
            $cordovaToast.show(msg, 'long', 'center');
        } else {
            alert(msg);
        }
    };

    return self;
})

.factory('Version', function($cordovaSQLite, DBA) {
    var self = this;

    self.get = function() {
        return DBA.query("SELECT id, version FROM version WHERE id = (1)")
            .then(function(result) {
                return DBA.getById(result);
            });
    }

    self.add = function(value) {
        return DBA.query("INSERT INTO version (id, version) VALUES (1,'" + value + "')");
    }

    self.update = function(value) {
        return DBA.query("UPDATE version SET version = '" + value + "' WHERE id = 1").catch(function(err) { console.log(err) });
    }

    return self;
})

.factory('Uporabnik', function($cordovaSQLite, DBA, $http, $cordovaToast) {
    var self = this

    self.getUser = function() {
        return DBA.query("SELECT * FROM uporabnik WHERE id_c=1")
            .then(function(result) {
                return DBA.getById(result);

            });

    }
    self.setUser = function(data) {
        var value = [];
        var attr = [];
        angular.forEach(data, function(val, key) {
            value.push("'" + val + "'");
            attr.push(key);
        })
        console.log(attr, value)
        return DBA.query("INSERT INTO uporabnik (id_c," + attr.join() + ") VALUES (1," + value.join() + ")");
    }

    self.removeUser = function(data) {
        return DBA.query("DELETE FROM uporabnik WHERE id_c=1");
    }

    self.loginUser = function(username, password) {
        return $http({
                method: 'POST',
                data: {
                    username: username,
                    password: password
                },
                url: 'http://faksfood2-ikces.rhcloud.com/uporabniki/login'
            })
            .then(function successCallback(response) {
                console.log(response)
                if (response.data != true) {
                    self.setUser(response.data);
                }
                return response.data;
            }, function errorCallback(response) {
                return false;
            });
    }

    self.register = function(data) {
        return $http({
                method: 'POST',
                data: data,
                url: 'http://faksfood2-ikces.rhcloud.com/uporabniki/register'
            })
            .then(function successCallback(response) {
                if (response.data.success == true)
                    self.setUser(response.data.data);
                return response.data;
            }, function errorCallback(response) {
                return response;
            });
    }

    return self;

})

//kulll
.factory('Ocene', function($cordovaSQLite, $http, $cordovaToast) {
    var self = this;

    self.getOceneByRestavracija = function(restavracije_id) {
        return $http({
            method: 'GET',
            url: 'http://faksfood2-ikces.rhcloud.com/ocene/restavracija/' + restavracije_id
        }).then(function successCallback(response) {
            console.log("response", response);
            return response.data;
        }, function errorCallback(response) {
            return "Cannot connect to faksfood API";
        });
    }

    self.getOceneByUser = function(uporabnik_id) {
        return $http({
            method: 'GET',
            url: 'http://faksfood2-ikces.rhcloud.com/ocene/uporabnik/' + uporabnik_id
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            return "Cannot connect to faksfood API";
        });
    }



    self.addOcena = function(ocena, restavracija, uporabnik) {
        $http({
            method: 'POST',
            data: {
                ocena: ocena,
                uporabnik_id: uporabnik,
                restavracije_id: restavracija
            },
            url: 'http://faksfood2-ikces.rhcloud.com/ocene/'

        }).then(function successCallback(response) {
            console.log("shranjena ocena")
                // if (response.data != true) {
                //     self.setUser(response.data);
                // }
            return response.data;
        }, function errorCallback(response) {
            console.log("ni shranjena ocena");
            // return null;
        });
    }

    return self;
})

.factory('Komentarji', function($cordovaSQLite, $http, $cordovaToast) {
    var self = this;

    self.getKomentarjiByRestavracija = function(restavracije_id) {
        return $http({
            method: 'GET',
            url: 'http://faksfood2-ikces.rhcloud.com/komentarji/restavracija/' + restavracije_id
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            return "Cannot connect to faksfood API";
        });
    }

    self.getKomentarjiByUser = function(uporabnik_id) {
        return $http({
            method: 'GET',
            url: 'http://faksfood2-ikces.rhcloud.com/komentarji/uporabnik/' + uporabnik_id
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            return "Cannot connect to faksfood API";
        });
    }

    self.removeKomentar = function(koment) {
        return $http({
            method: 'DELETE',
            url: 'http://faksfood2-ikces.rhcloud.com/komentarji/' + koment.id
        }).then(function successCallback(response) {
            return response.data;
        }, function errorCallback(response) {
            return "Cannot connect to faksfood API";
        });
    }

    self.addKomentar = function(vsebina, restavracija, uporabnik) {
        var da = new Date();
        return $http({
            method: 'POST',
            data: {
                vsebina: vsebina,
                uporabnik_id: uporabnik,
                restavracije_id: restavracija,
                datum: da
            },
            url: 'http://faksfood2-ikces.rhcloud.com/komentarji/'

        }).then(function successCallback(response) {

            // if (response.data != true) {
            //     self.setUser(response.data);
            // }
            return response.data;
        }, function errorCallback(response) {

            return null;
        });
    }

    return self;
})
