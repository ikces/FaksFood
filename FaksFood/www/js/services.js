angular.module('app.services', [])


//PUST TO :)
.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
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
    if(result.rows.length != 0){
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    }
    else return [];

  }

  return self;
})


.factory('Team', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    return DBA.query("SELECT id, name FROM team")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.get = function(memberId) {
    var parameters = [memberId];
    return DBA.query("SELECT id, name FROM team WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(member) {
    var parameters = [member.id, member.name];
    return DBA.query("INSERT INTO team (id, name) VALUES (?,?)", parameters);
  }

  self.remove = function(member) {
    var parameters = [member.id];
    return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
  }

  self.update = function(origMember, editMember) {
    var parameters = [editMember.id, editMember.name, origMember.id];
    return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  }

  return self;
})
.factory('Restavracije', function($cordovaSQLite, DBA, $http, $cordovaToast) {
  var self = this;

  self.getFromApiRestavracije = function(){
  	$http({
      method: 'GET',
      url: 'http://faksfood2-ikces.rhcloud.com/restavracije'})
    .then(function successCallback(response) {
      DBA.query("DELETE FROM restavracije");
      var sqlArr = [];
      var sqlString = "INSERT INTO restavracije(dolzina, `guid`, kraj_id, naziv, sirina, telefon, ulica, vrednost_obroka) VALUES";
      angular.forEach(response.data, function(value, key) {
        sqlArr.push("('"+value.dolzina+"','"+value.guid+"', '"+value.kraj_id+"','"+value.naziv.replace(/'/g,"")+"',"+
                    "'"+value.sirina+"','"+value.telefon+"','"+value.ulica+"','"+value.vrednost_obroka+"')");
      });
      if(sqlArr.length != 0){
        sqlString += sqlArr.join();
        DBA.query(sqlString).then(function(resp){
          self.getFromApiMenus();
        }).catch(function(err){
          console.log(err);
        });
      }   
  	}, function errorCallback(response) {
      return "Cannot connect to faksfood API";
  	});
  }
  self.getFromApiMenus = function(){
    $http({
      method: 'GET',
      url: 'http://faksfood2-ikces.rhcloud.com/restavracije/jedi'})
    .then(function successCallback(response) {
      DBA.query("DELETE FROM jedilniki");
      var sqlArr = [];
      var sqlString = "INSERT INTO jedilniki(restavracije_id, jedi) VALUES";
      angular.forEach(response.data, function(value, key) {
        sqlArr.push("('"+value.restavracije_id+"','"+value.jedi+"')");
      });
      if(sqlArr.length != 0){
        sqlString += sqlArr.join();
        DBA.query(sqlString).then(function(resp){
          self.showToast("Posodobljeno!");
        });
      }   
    }, function errorCallback(response) {
      return "Cannot connect to faksfood API";
    });
  }


  self.getRestavracije = function(){
    return DBA.query("SELECT * FROM restavracije")
      .then(function(result){
        return DBA.getAll(result);
      });
  }



  self.getMenije = function(id){

    return DBA.query("SELECT * FROM jedilniki WHERE restavracije_id="+id)
      .then(function(result){
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
    return DBA.query("INSERT INTO version (id, version) VALUES (1,'"+value+"')");
  }


  self.update = function(value) {
    return DBA.query("UPDATE version SET version = '"+value+"' WHERE id = 1").catch(function(err){console.log(err)});
  }

  return self;
})

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

});