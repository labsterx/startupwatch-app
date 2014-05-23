angular.module('myApp.search', [
    'myApp.config',
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "js/search/search-form.html",
          controller: 'SearchController'
        }
      }
    })

})

.factory('SearchService', function ($http) {

	'use strict';

	return {

		search: function (query, type, callback, errCallback) {
			var url = 'https://api.angel.co/1/search' + '?callback=JSON_CALLBACK';
			var config = {
				params: {
					query: query
				}
			};
			if (type) {
				config.params.type = type;
			}
			$http.jsonp(url, config)
			.success(function(results) {
				// console.log(results);
				callback(results);
			})
			.error(function(data, status, headers, config) {
		      	if (errCallback) {
		      		errCallback();
		      	}
		    });
		}

	};

})

.controller('SearchController', [
	'$scope', 'SearchService', '$ionicLoading', '$location', 'appConfig', '$ionicPopup',
	function ($scope, SearchService, $ionicLoading, $location, appConfig, $ionicPopup) {

		$scope.search_type = "startup";

		function resetStartupSearch () {
			$scope.startupSearch = {
				query: '',
				type: ''
			};
			$scope.startupResults = [];
			$scope.no_startup_results = false;
		}

		function resetJobSearch () {
			$scope.jobSearch = {
				query: '',
				type: ''
			};
			$scope.jobResults = [];
			$scope.no_job_results = false;
		}

		function showSearchResult (item) {
			var path = item.path;
			$location.path(path);
		}

		resetStartupSearch();
		resetJobSearch();

		$scope.showSearchResult = showSearchResult;

		$scope.changeSearchType = function(type) {
			$scope.search_type = type;
		}

		$scope.doStartupSearch = function(searchType) {

			$scope.no_startup_results = false;

			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		SearchService.search($scope.startupSearch.query, '', function(results){
				$ionicLoading.hide();
				var filteredResults = [];
				for (var i=0; i<results.length; i++) {
					var item = results[i];
					var type = item.type;
					if (type == searchType) {
						if (type == 'Startup') {
							item.localLink = '#/app/startup/' + item.id;
							item.path = "/app/startup/" + item.id;
							item.icon = "ion-document-text";
						}
						else if (type == 'LocationTag') {
							item.localLink = '#/app/startups/tag/' + item.id;
							item.path = '/app/startups/tag/' + item.id;
							item.icon = "ion-android-earth";
						}
						else if (type == 'MarketTag') {
							item.localLink = '#/app/startups/tag/' + item.id;
							item.path = '/app/startups/tag/' + item.id;
							item.icon = "ion-search";
						}
						else {
							item.localLink = '';
						}
						filteredResults.push(item);
					}
				}
				if (filteredResults.length == 1) {
					var item = filteredResults[0];
					showSearchResult(item);
				}
				else {
					$scope.startupResults = filteredResults;
					if (filteredResults.length == 0) {
						$scope.no_startup_results = true;
					}
					else {
						$scope.no_startup_results = false;	
					}
				}
			}, function() {
				$ionicLoading.hide();
				$ionicPopup.alert(appConfig.loadingErrorPopup);
				// $scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.doJobSearch = function(searchType) {

			$scope.no_job_results = false;
			
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		SearchService.search($scope.jobSearch.query, '', function(results){
				$ionicLoading.hide();
				var filteredResults = [];
				for (var i=0; i<results.length; i++) {
					var item = results[i];
					var type = item.type;
					if (type == searchType) {
						if (type == 'Startup') {
							item.localLink = '#/jobs/startup/' + item.id;
							item.path = "/jobs/startup/" + item.id;
							item.icon = "ion-document-text";
						}
						else if (type == 'LocationTag') {
							item.localLink = '#/app/jobs/tag/' + item.id;
							item.path = '/app/jobs/tag/' + item.id;
							item.icon = "ion-android-earth";
						}
						else {
							item.localLink = '';
						}
						filteredResults.push(item);
					}
				}
				if (filteredResults.length == 1) {
					var item = filteredResults[0];
					$scope.showSearchResult(item);
				}
				else {
					$scope.jobResults = filteredResults;
					if (filteredResults.length == 0) {
						$scope.no_job_results = true;
					}
					else {
						$scope.no_job_results = false;	
					}
				}
			}, function() {
				$ionicLoading.hide();
				$ionicPopup.alert(appConfig.loadingErrorPopup);
			});
		};

		$scope.clearStartupSearch = function() {
			resetStartupSearch();
		};

		$scope.clearJobSearch = function() {
			console.log('clearJobSearch');			
			resetJobSearch();
		}		



	}

]);