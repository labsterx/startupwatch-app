angular.module('myApp.startups', [
	'ionic',
	'myApp.config',
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app.startups', {
      url: "/startups",
      views: {
        'menuContent' :{
          templateUrl: "js/startups/startups-list.html",
          controller: 'StartupsController'
        }
      }
    })

    .state('app.startup', {
      url: "/startup/:startupId",
      views: {
        'menuContent' :{
          templateUrl: "js/startups/startups-single.html",
          controller: 'StartupController'
        }
      }
  	})

    .state('app.startup_by_tag', {
      url: "/startups/tag/:tagId",
      views: {
        'menuContent' :{
          templateUrl: "js/startups/startups-list.html",
          controller: 'StartupsTagController'
        }
      }
  	})

})

.factory('StartupsService', function ($http, $location) {

	'use strict';

	function processListResult (data) {
		var results = {};
		var meta = {
			total: data.total,
			per_page: data.per_page,
			page: data.page,
			last_page: data.last_page,
		};
		var list = [];
		for (var i=0; i<data.startups.length; i++) {
			var item = data.startups[i];
			if (!item.hidden) {
				list.push(item);
			}
		}
		results.meta = meta;
		results.startups = list;
		return results;
	}

	return {

		listStartups: function (page, callback) {
			var tag_earth = '1643';
			var url = 'https://api.angel.co/1/tags/' + tag_earth + '/startups' + '?page=' + page + '&order=desc&callback=JSON_CALLBACK';
			// console.log('Calling ' + url);
			$http.jsonp(url).success(function(data) {
				var results = processListResult(data);
				callback(results);
			});
		},

		listStartupsByTag: function (page, tagId, callback) {
			var url = 'https://api.angel.co/1/tags/' + tagId + '/startups'  + '?page=' + page + '&callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(data) {
				var results = processListResult(data);
				callback(results);
			});
		},

		getStartup: function (startupId, callback) {
			var url = 'https://api.angel.co/1/startups/' + startupId + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				callback(results);
			});
		},

	};

})

.controller('StartupsController', [
	'$scope', 'StartupsService', '$ionicLoading', '$location', 'appConfig', 
	function ($scope, StartupsService, $ionicLoading, $location, appConfig) {

		$scope.startups = [];
		$scope.meta = {};

		$scope.loadStartups = function() {
			var page;
			if ($scope.meta.page && $scope.meta.last_page) {
				if ($scope.meta.page < $scope.meta.last_page) {
					page = $scope.meta.page + 1;
				}
				else {
					return;
				}
			}
			else {
				page = 1;
			}
			console.log('loadStartups. Page=' + page);			
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		StartupsService.listStartups(page, function(results){
    			// console.log(results);
				$ionicLoading.hide();
				$scope.startups = $scope.startups.concat(results.startups);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.showStartupPage = function(startup) {
			var path = "/app/startup/" + startup.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadStartups();
		});

		// $scope.loadStartups();

	}

])

.controller('StartupsTagController', [
	'$scope', 'StartupsService', '$stateParams', '$ionicLoading', '$location', 'appConfig',
	function ($scope, StartupsService, $stateParams, $ionicLoading, $location, appConfig) {

		$scope.startups = [];
		$scope.meta = {};

		$scope.loadStartups = function() {

			var tagId = $stateParams.tagId;
			var page;
			if ($scope.meta.page && $scope.meta.last_page) {
				if ($scope.meta.page < $scope.meta.last_page) {
					page = $scope.meta.page + 1;
				}
				else {
					return;
				}
			}
			else {
				page = 1;
			}
			console.log('loadStartups. Page=' + page);
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		StartupsService.listStartupsByTag(page, tagId, function(results){
				$ionicLoading.hide();
				$scope.startups = $scope.startups.concat(results.startups);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.showStartupPage = function(startup) {
			var path = "/app/startup/" + startup.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadStartups();
		});

		// $scope.loadStartups();

	}

])

.controller('StartupController', [
	'$scope', 'StartupsService', '$stateParams', '$ionicLoading', 'appConfig', 
	function ($scope, StartupsService, $stateParams, $ionicLoading, appConfig) {

		$scope.loadStartup = function() {

			var startupId = $stateParams.startupId;

			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		StartupsService.getStartup(startupId, function(results){
				$ionicLoading.hide();
				$scope.startup = results;
			});
		};

		$scope.showStartupPage = function(startup) {
			var path = "/app/startup/" + startup.id;
			$location.path( path );
		}

		$scope.loadStartup();

	}

]);

