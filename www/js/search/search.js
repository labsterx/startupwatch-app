angular.module('myApp.search', [
	'ionic',
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

		search: function (query, type, callback) {
			var url = 'https://api.angel.co/1/search' + '?callback=JSON_CALLBACK';
			var config = {
				params: {
					query: query
				}
			};
			if (type) {
				config.params.type = type;
			}
			$http.jsonp(url, config).success(function(results) {
				callback(results);
			});
		}

	};

})

.controller('SearchController', [
	'$scope', 'SearchService', '$ionicLoading', '$location', 'appConfig', 
	function ($scope, SearchService, $ionicLoading, $location, appConfig) {

		if (!$scope.search) {
			$scope.search = {
				query: '',
				type: ''
			};
		}

		if ($scope.results) {
			$scope.results = [];
		}

		$scope.no_results = false;

		$scope.doSearch = function(searchType) {

			$scope.no_results = false;

			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		SearchService.search($scope.search.query, '', function(results){
				$ionicLoading.hide();
				var filteredResults = []
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
					var path = filteredResults[0].path;
					$location.path(path);
				}
				else {
					$scope.results = filteredResults;
					if (filteredResults.length == 0) {
						$scope.no_results = true;
					}
					else {
						$scope.no_results = false;	
					}
				}
			});
		};

	}

]);