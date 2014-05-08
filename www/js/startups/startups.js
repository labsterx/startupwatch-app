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

	return {

		// HACK!!!!!
		listStartups: function (callback) {
			var url = 'https://api.angel.co/1/tags/1654/startups' + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				callback(results);
			});
		},

		getStartup: function (startupId, callback) {
			var url = 'https://api.angel.co/1/startups/' + startupId + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				callback(results);
			});
		},

		listStartupsByTag: function (tagId, callback) {
			var url = 'https://api.angel.co/1/tags/' + tagId + '/startups' + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				callback(results);
			});
		}

	};

})

.controller('StartupsController', [
	'$scope', 'StartupsService', '$ionicLoading',
	function ($scope, StartupsService, $ionicLoading) {

		$scope.loadStartups = function() {
			$ionicLoading.show({
				template: 'Loading...'
			});	
    		StartupsService.listStartups(function(results){
				$ionicLoading.hide();
				$scope.startups = results.startups;
			});
		};

		$scope.loadStartups();

	}

])

.controller('StartupsTagController', [
	'$scope', 'StartupsService', '$stateParams', '$ionicLoading', 
	function ($scope, StartupsService, $stateParams, $ionicLoading) {

		$scope.loadStartups = function() {

			var tagId = $stateParams.tagId;

			$ionicLoading.show({
				template: 'Loading...'
			});	
    		StartupsService.listStartupsByTag(tagId, function(results){
				$ionicLoading.hide();
				$scope.startups = results.startups;
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

