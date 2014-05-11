angular.module('myApp.jobs', [
	'ionic',
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

.factory('JobsService', function ($http) {

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
		for (var i=0; i<data.jobs.length; i++) {
			var item = data.jobs[i];
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
			list.push(item);
		}
		results.meta = meta;
		results.jobs = list;
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

		listJobs: function (page, callback) {
			var url = 'https://api.angel.co/1/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			// console.log('Calling ' + url);
			$http.jsonp(url).success(function(data) {
				var results = processListResult(data);
				callback(results);
			});
		},

		listJobsByTag: function (page, tagId, callback) {
			var url = 'https://api.angel.co/1/tags/' + tagId + '/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				var list = processListResult(results);
				callback(list);
			});
		},	

		listJobsByStartup: function (page, startupId, callback) {
			var url = 'https://api.angel.co/1/startups/' + startupId + '/jobs' + '?page=' + page + '&callback=JSON_CALLBACK';
			console.log('listJobsByStartup. url=' + url);
			$http.jsonp(url).success(function(results) {
				var list = processListResult(results);
				callback(list);
			});
		},

		getJob: function (jobId, callback) {
			var url = 'https://api.angel.co/1/jobs/' + jobId + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				var detail = processJobResult(results);
				callback(detail);
			});
		}
	};

})

.controller('JobsController', [
	'$scope', 'JobsService', '$ionicLoading', '$location', 'appConfig', 
	function ($scope, JobsService, $ionicLoading, $location, appConfig) {

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
			});
		};

		$scope.showJobPage = function(job) {
			var path = "/app/job/" + job.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadJobs();
		});

		// $scope.loadJobs();
	}

])

.controller('JobsTagController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', '$location', 'appConfig',
	function ($scope, JobsService, $stateParams, $ionicLoading, $location, appConfig) {

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
			});
		};

		$scope.showJobPage = function(job) {
			var path = "/app/job/" + job.id;
			$location.path( path );
		}

		$scope.$on('stateChangeSuccess', function() {
		    $scope.loadJobs();
		});

		// $scope.loadJobs();

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

		// $scope.loadJobs();

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

