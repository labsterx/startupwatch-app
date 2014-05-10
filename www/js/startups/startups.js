angular.module('myApp.startups', [
	'ionic'
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

.factory('StartupsService', function ($http) {

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

		// HACK!!!!!
		listStartups: function (page, callback) {
			var url = 'https://api.angel.co/1/tags/1654/startups' + '?page=' + page + '&callback=JSON_CALLBACK';
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
	'$scope', 'StartupsService', '$ionicLoading',
	function ($scope, StartupsService, $ionicLoading) {

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
			$ionicLoading.show({
				template: 'Loading...'
			});	
    		StartupsService.listStartups(page, function(results){
    			console.log(results);
				$ionicLoading.hide();
				$scope.startups = $scope.startups.concat(results.startups);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.loadStartups();

	}

])

.controller('StartupsTagController', [
	'$scope', 'StartupsService', '$stateParams', '$ionicLoading', 
	function ($scope, StartupsService, $stateParams, $ionicLoading) {

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
			$ionicLoading.show({
				template: 'Loading...'
			});	
    		StartupsService.listStartupsByTag(page, tagId, function(results){
				$ionicLoading.hide();
				$scope.startups = $scope.startups.concat(results.startups);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.loadStartups();

	}

])

.controller('StartupController', [
	'$scope', 'StartupsService', '$stateParams', '$ionicLoading', 
	function ($scope, StartupsService, $stateParams, $ionicLoading) {

		$scope.loadStartup = function() {

			var startupId = $stateParams.startupId;

			$ionicLoading.show({
				template: 'Loading...'
			});	
    		StartupsService.getStartup(startupId, function(results){
				$ionicLoading.hide();
				$scope.startup = results;
			});
		};

		$scope.loadStartup();

	}

]);

