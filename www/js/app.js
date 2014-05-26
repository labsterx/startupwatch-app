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

.controller('AppCtrl', ['$scope', '$state', function($scope, $state) {

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

})

.directive('browseTo', function ($ionicGesture) {
 return {
  restrict: 'A',
  link: function ($scope, $element, $attrs) {
   var handleTap = function (e) {
    // todo: capture Google Analytics here
    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
   };
   var tapGesture = $ionicGesture.on('tap', handleTap, $element);
   $scope.$on('$destroy', function () {
    // Clean up - unbind drag gesture handler
    $ionicGesture.off(tapGesture, 'tap', handleTap);
   });
  }
 }
})

.factory('URLCache', function($cacheFactory) {

    var cache_time = 60;    // in seconds;

    function getTime() {
        var time = parseInt((new Date).getTime() / 1000);
        return time;
    }

    function getPageNumberFromUrl(url) {
        var regexp = /page=(\d+)/i;
        var match = regexp.exec(url);
        var pageNo = match[1];
        return pageNo;
    }

    return {

        getCache: function(url) {

            if (getPageNumberFromUrl(url) > 1) {
                return false;
            }
            var cache = $cacheFactory.get(url);
            if (cache && cache.get('time') > getTime() - cache_time) {
                // console.log('cached');
                var data = cache.get('data');
                return data;
            }
            else {
                return false;
            }

        },

        setCache: function(url, data) {
            if (getPageNumberFromUrl(url) > 1) {
                return false;
            }
            var cache = $cacheFactory.get(url); 
            if (!cache) {
                cache = $cacheFactory(url);
            }
            var now = getTime();
            cache.remove('data');
            cache.put('data', data);
            cache.remove('time');
            cache.put('time', now);
        }

    }

});



