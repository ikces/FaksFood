angular.module('app.controllers', [])
     
.controller('loginCtrl', function($scope) {

})
   
.controller('signupCtrl', function($scope) {

})
   
.controller('restavracijeCtrl', function($scope, Restavracije) {
	console.log("asd");
	Restavracije.getRestavracije().then(function(data){
		console.log(data);
	});
	/*$scope.test=null;
	var object={
		id: 1,
		name: 'test'
	};
	Team.add(object);
	Team.get(1).then(function(team){
		console.log(team);
		$scope.test=team;
	});	*/
})
   
.controller('zemljevidCtrl', function($scope) {

})
   
.controller('profilCtrl', function($scope) {
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
 