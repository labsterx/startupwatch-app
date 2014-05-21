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
    ref.addEventListener('loadstart', function(event) {
      console.log(event.url);
      alert(event.url); 
    });
    ref.addEventListener('exit', function() {
      console.log('exit');
      alert('exit');
      ref.close();
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

