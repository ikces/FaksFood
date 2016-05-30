angular.module('app.services', [])

.service('CurrentRestavracija', function() {
  var productList = null;

  var setCurrent = function(restavracija) {
      productList = restavracija;
      console.log("tu sm");
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