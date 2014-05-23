angular.module('myApp.config', [])

.constant('appConfig', {
	'loadingTemplate': '<i class="icon icon-large ion-loading-b"></i>',
	'loadingErrorPopup': {
		title: "Error",
		template: "Sorry, there's a problem loading the contents. Please try again later."
	}
});


