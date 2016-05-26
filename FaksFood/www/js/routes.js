angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/ze',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/page6',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('tabsController.restavracije', {
    url: '/restavracije',
    views: {
      'tab1': {
        templateUrl: 'templates/restavracije.html',
        controller: 'restavracijeCtrl'
      }
    }
  })

  .state('tabsController.zemljevid', {
    url: '/zemljevid',
    views: {
      'tab2': {
        templateUrl: 'templates/zemljevid.html',
        controller: 'zemljevidCtrl'
      }
    }
  })

  .state('tabsController.profil', {
    url: '/profil',
    views: {
      'tab3': {
        templateUrl: 'templates/profil.html',
        controller: 'profilCtrl'
      }
    }
  })

  .state('tabsController.restavracija', {
    url: '/restavracija',
    views: {
      'tab1': {
        templateUrl: 'templates/restavracija.html',
        controller: 'restavracijaCtrl'
      }
    }
  })

  .state('tabsController.meni', {
    url: '/meni',
    views: {
      'tab1': {
        templateUrl: 'templates/meni.html',
        controller: 'meniCtrl'
      }
    }
  })

  .state('tabsController.komentarji', {
    url: '/komentarji',
    views: {
      'tab3': {
        templateUrl: 'templates/komentarji.html',
        controller: 'komentarjiCtrl'
      }
    }
  })

  .state('tabsController.ocene', {
    url: '/ocene',
    views: {
      'tab3': {
        templateUrl: 'templates/ocene.html',
        controller: 'oceneCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/ze/restavracije')

  

});