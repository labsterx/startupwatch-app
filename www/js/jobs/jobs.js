angular.module('myApp.jobs', [
	'myApp.config',
])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app.jobs', {
      url: "/jobs",
      views: {
        'menuContent' :{
          templateUrl: "js/jobs/jobs-list.html",
          controller: 'JobsController'
        }
      }
    })

    .state('app.job', {
      url: "/job/:jobId",
      views: {
        'menuContent' :{
          templateUrl: "js/jobs/jobs-single.html",
          controller: 'JobController'
        }
      }
  	})

    .state('app.jobs_by_tag', {
      url: "/jobs/tag/:tagId",
      views: {
        'menuContent' :{
          templateUrl: "js/jobs/jobs-list.html",
          controller: 'JobsTagController'
        }
      }
  	})

    .state('app.jobs_by_startup', {
      url: "/jobs/startup/:startupId",
      views: {
        'menuContent' :{
          templateUrl: "js/jobs/jobs-list.html",
          controller: 'JobsStartupController'
        }
      }
  	})  	

})

.factory('JobsService', function ($http, URLCache) {

	'use strict';

	function processListResult (data, tagId) {
		var results = {};
		var meta = {
			total: data.total,
			per_page: data.per_page,
			page: data.page,
			last_page: data.last_page,
			page_title: 'New Jobs'
		};
		var list = [];
		var tag_found = false;
		for (var i=0; i<data.jobs.length; i++) {
			var item = data.jobs[i];
			item.job_skills = [];
			item.job_roles = [];
			item.job_locations = [];
			for (var j=0; j<item.tags.length; j++) {
				var tag = item.tags[j];
				if (tag.tag_type == 'LocationTag') {
					item.job_locations.push(tag);
					if (tagId && !tag_found && (tag.id == tagId)) {
						tag_found = true;
						meta.page_title = "Jobs in " + tag.display_name;
					}
				}
				else if (tag.tag_type == 'RoleTag') {
					item.job_roles.push (tag);
					if (tagId && !tag_found && (tag.id == tagId)) {
						tag_found = true;
						meta.page_title = "Jobs as " + tag.display_name;
					}					
				}
				else if (tag.tag_type == 'SkillTag') {
					item.job_skills.push(tag);
					if (tagId && !tag_found && (tag.id == tagId)) {
						tag_found = true;
						meta.page_title = "Jobs for " + tag.display_name;
					}					
				}				
			}
			list.push(item);
		}
		results.meta = meta;
		results.jobs = list;
		// console.log(results);
		return results;
	}

	function processJobResult (result) {
		var item = result;
		item.job_skills = [];
		item.job_roles = [];
		item.job_locations = [];
		for (var j=0; j<item.tags.length; j++) {
			var tag = item.tags[j];
			if (tag.tag_type == 'LocationTag') {
				item.job_locations.push(tag);
			}
			else if (tag.tag_type == 'RoleTag') {
				item.job_roles.push (tag);
			}
			else if (tag.tag_type == 'SkillTag') {
				item.job_skills.push(tag);
			}
		}
		return item;
	}

	return {

		listJobs: function (page, callback, errCallback) {
			var url = 'https://api.angel.co/1/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			// console.log('Calling ' + url);
			var cached_data = URLCache.getCache(url);
			if (cached_data) {
				callback(cached_data);
			}
			else {
				$http.jsonp(url)
				.success(function(data) {
					var results = processListResult(data);
					URLCache.setCache(url, results);
					callback(results);
				})
				.error(function(data, status, headers, config) {
			      	if (errCallback) {
			      		errCallback();
			      	}
			    });
			}
		},

		listJobsByTag: function (page, tagId, callback, errCallback) {
			var url = 'https://api.angel.co/1/tags/' + tagId + '/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			// console.log(url);
			var cached_data = URLCache.getCache(url);
			if (cached_data) {
				callback(cached_data);
			}
			else {			
				$http.jsonp(url)
				.success(function(results) {
					var list = processListResult(results, tagId);
					URLCache.setCache(url, list);
					callback(list);
				})
				.error(function(data, status, headers, config) {
			      	if (errCallback) {
			      		errCallback();
			      	}
			    });
			}
		},	

		listJobsByStartup: function (page, startupId, callback, errCallback) {
			var url = 'https://api.angel.co/1/startups/' + startupId + '/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			// console.log('listJobsByStartup. url=' + url);
			var cached_data = URLCache.getCache(url);
			if (cached_data) {
				callback(cached_data);
			}
			else {
				$http.jsonp(url)
				.success(function(results) {
					var list = processListResult(results);
					URLCache.setCache(url, list);
					callback(list);
				})
				.error(function(data, status, headers, config) {
			      	if (errCallback) {
			      		errCallback();
			      	}
			    });				
			}
		},

		getJob: function (jobId, callback, errCallback) {
			var url = 'https://api.angel.co/1/jobs/' + jobId + '?callback=JSON_CALLBACK';
			$http.jsonp(url)
			.success(function(results) {
				var detail = processJobResult(results);
				callback(detail);
			})
			.error(function(data, status, headers, config) {
		      	if (errCallback) {
		      		errCallback();
		      	}
		    });
		}
	};

})

.controller('JobsController', [
	'$scope', 'JobsService', '$ionicLoading', '$location', 'appConfig', '$ionicPopup',
	function ($scope, JobsService, $ionicLoading, $location, appConfig, $ionicPopup) {

		$scope.jobs = [];
		$scope.meta = {};

		$scope.loadJobs = function() {
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
			console.log('loadJobs. page=' + page);
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});
    		JobsService.listJobs(page, function(results){
				$ionicLoading.hide();
				$scope.jobs = $scope.jobs.concat(results.jobs);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}, function() {
				$ionicLoading.hide();
				$ionicPopup.alert(appConfig.loadingErrorPopup);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.showJobPage = function(job) {
			var path = "/app/job/" + job.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadJobs();
		});

	}

])

.controller('JobsTagController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', '$location', 'appConfig', '$ionicPopup',
	function ($scope, JobsService, $stateParams, $ionicLoading, $location, appConfig, $ionicPopup) {

		$scope.jobs = [];
		$scope.meta = {};

		$scope.loadJobs = function() {

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
			console.log('LoadJobs by Tag. page=' + page);
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		JobsService.listJobsByTag(page, tagId, function(results){
				$ionicLoading.hide();
				$scope.jobs = $scope.jobs.concat(results.jobs);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}, function() {
				$ionicLoading.hide();
				$ionicPopup.alert(appConfig.loadingErrorPopup);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.showJobPage = function(job) {
			var path = "/app/job/" + job.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadJobs();
		});

	}

])


.controller('JobsStartupController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', '$location', 'appConfig',
	function ($scope, JobsService, $stateParams, $ionicLoading, $location, appConfig) {

		$scope.jobs = [];
		$scope.meta = {};

		console.log('JobsStartupController');

		$scope.loadJobs = function() {

			var startupId = $stateParams.startupId;
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
			console.log('LoadJobs by Startup. page=' + page);
			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		JobsService.listJobsByStartup(page, startupId, function(results){
				$ionicLoading.hide();
				$scope.jobs = $scope.jobs.concat(results.jobs);
				$scope.meta = results.meta;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		};

		$scope.showJobPage = function(job) {
			var path = "/app/job/" + job.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadJobs();
		});

	}

])

.controller('JobController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', '$location', 'appConfig',
	function ($scope, JobsService, $stateParams, $ionicLoading, $location, appConfig) {

		$scope.loadJob = function() {

			var jobId = $stateParams.jobId;

			$ionicLoading.show({
				template: appConfig.loadingTemplate,
			});	
    		JobsService.getJob(jobId, function(results){
				$ionicLoading.hide();
				$scope.job = results;
			});
		};

		$scope.loadJob();

	}

]);

