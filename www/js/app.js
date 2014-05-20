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

