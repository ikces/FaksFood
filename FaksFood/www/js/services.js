angular.module('app.services', [])

.service('CurrentRestavracija', function() {
        var productList = null;

        var setCurrent = function(restavracija) {
            productList = restavracija;
            console.log("service", productList);
        };

        var getCurrent = function() {
            return productList;
        };
        return {
            setCurrent: setCurrent,
            getCurrent: getCurrent
        };
    })
    .service('UpdateRestavracije', function() {
        var version = 1;

        function getVersion() {
            return version;
        }

        function setVersion(newVersion) {
            version = newVersion;

        }
        return {
            getVersion: getVersion,
            setVersion: setVersion,
        }
    })

.service('UporabnikPrijavlen', function(Uporabnik) {
    var user = null;

    function getCurrentUser(callback) {
        if (callback != null) callback(user);
        return user;
    }

    function getUser() {
        this.user = Uporabnik.getUser().then(function(getdata) {
            return getdata;
        })
    }

    function removeUser() {
        Uporabnik.removeUser().then(function(getdata) {
            user = null;
        });
    }

    function setUser() {
        Uporabnik.getUser().then(function(getdata) {
            if (getdata.length == 0)
                user = null
            else
                user = getdata;
        });
    }

    function loginUser(username, password) {
        Uporabnik.loginUser(username, password).then(function(getdata) {
            user = getdata;
        });
    }

    function registerUser(data) {
        return Uporabnik.register(data).then(function(getdata) {
            if (getdata.success != false) {
                setUser(getdata.data)
                return true;
            } else return getdata.error;
        });
    }

    return {
        getUser: getUser,
        setUser: setUser,
        removeUser: removeUser,
        loginUser: loginUser,
        registerUser: registerUser,
        getCurrentUser: getCurrentUser
    }

});
