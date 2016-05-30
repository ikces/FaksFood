angular.module('app.services', [])

.service('CurrentRestavracija', function() {
  var productList = null;

  var setCurrent = function(restavracija) {
      productList = restavracija;
      console.log("service", productList);
  };

  var getCurrent = function(){
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
});


.service ('UporabnikPrijavlen', function(Uporabnik){
  var user = null;


function getUser() {
        return user;
    }
    function setUser() {
    Uporabnik.getUser().then(function(getdata){  
      console.log(getdata);
       if(getdata.length != 0){

        user = getdata;
       }

    });
    }
    return {
        getUser: getUser,
        setUser: setUser,
    }

});