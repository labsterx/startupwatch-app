angular.module('myApp', [
    'ionic',
    'myApp.config',
    'myApp.jobs',
    'myApp.startups',
    'myApp.search'
    ])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller('AppCtrl', ['$scope', function($scope) {

  $scope.openNewBrowser= function(url, showLocationBar) {
    var ref;
    if (typeof showLocationBar === 'undefined') { 
      showLocationBar = true;
    }
    if (showLocationBar) {
      ref = window.open(url, '_blank', 'location=yes,toolbar=yes');
    }
    else {
      ref = window.open(url, '_blank');
    }
    ref.addEventListener('loadstart', function() { 
      alert(event.url); 
    });
    ref.addEventListener('exit', function() {
      alert('exit');
      navigator.app.exitApp();
    });
  }

}])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "js/components/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "js/pages/about.html"
        }
      }
    });

    $urlRouterProvider.otherwise('/app/search');

});

