angular.module('myApp.jobs', [
	'ionic'
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

})

.factory('JobsService', function ($http) {

	'use strict';

	function processListResult (results) {
		var list = [];
		for (var i=0; i<results.jobs.length; i++) {
			var item = results.jobs[i];
			for (var j=0; j<item.tags.length; j++) {
				var tag = item.tags[j];
				if (tag.tag_type == 'LocationTag') {
					item.job_location = {
						name: tag.display_name,
						tag: tag.id
					};
				}
				else if (tag.tag_type == 'RoleTag') {
					item.job_role = {
						name: tag.display_name,
						tag: tag.id
					};
				}
			}
			list.push(item);
		}
		return list;
	}

	function processJobResult (result) {
		var item = result;
		item.skill_list = [];
		for (var j=0; j<item.tags.length; j++) {
			var tag = item.tags[j];
			if (tag.tag_type == 'LocationTag') {
				item.job_location = {
					name: tag.display_name,
					tag: tag.id
				};
			}
			else if (tag.tag_type == 'RoleTag') {
				item.job_role = {
					name: tag.display_name,
					tag: tag.id
				};
			}
			else if (tag.tag_type == 'SkillTag') {
				tag.tag = tag.id;
				tag.name = tag.display_name;
				item.skill_list.push(tag);
			}
		}
		return item;
	}

	return {

		listJobs: function (callback) {
			var url = 'https://api.angel.co/1/jobs' + '?callback=JSON_CALLBACK';
			$http.jsonp(url).success(function(results) {
				var list = processListResult(results);
				callback(list);
			});
		},

		listJobsByTag: function (tagId, callback) {
			var url = 'https://api.angel.co/1/tags/' + tagId + '/jobs' + '?callback=JSON_CALLBACK';
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
	'$scope', 'JobsService', '$ionicLoading',
	function ($scope, JobsService, $ionicLoading) {

		$scope.loadJobs = function() {
			$ionicLoading.show({
				template: 'Loading...'
			});	
    		JobsService.listJobs(function(results){
				$ionicLoading.hide();
				$scope.jobs = results;
			});
		};

		$scope.loadJob = function() {

		}

		$scope.loadJobs();

	}

])

.controller('JobsTagController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', 
	function ($scope, JobsService, $stateParams, $ionicLoading) {

		$scope.loadJobs = function() {

			var tagId = $stateParams.tagId;

			$ionicLoading.show({
				template: 'Loading...'
			});	
    		JobsService.listJobsByTag(tagId, function(results){
				$ionicLoading.hide();
				$scope.jobs = results;
			});
		};

		$scope.loadJobs();

	}

])

.controller('JobController', [
	'$scope', 'JobsService', '$stateParams', '$ionicLoading', 
	function ($scope, JobsService, $stateParams, $ionicLoading) {

		$scope.loadJob = function() {

			var jobId = $stateParams.jobId;

			$ionicLoading.show({
				template: 'Loading...'
			});	
    		JobsService.getJob(jobId, function(results){
				$ionicLoading.hide();
				$scope.job = results;
			});
		};

		$scope.loadJob();

	}

]);

