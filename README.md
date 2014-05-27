Startup Watch
=========

Startup Watch is a mobile app with information on startup companies and startup jobs around the world. With this app you can view new startup listings and search for startups by location and market type. You can also view new startup job openings and search for jobs by location.

This app is an HTML5 hybrid app written in JavaScript, developed with AngularJS and the Ionic framework. The data source for this app is the [AngelList API](https://angel.co/api).

You can download the Android version of this app from the [Google Play Store](https://play.google.com/store/apps/details?id=com.labsterx.app.startupwatch).

This app can also be tried out using web browers by serving the source code under the www directory on a web server.

The official website for this app is at: [http://www.labsterx.com/projects/startup-watch/](http://www.labsterx.com/projects/startup-watch/).

Installation
--------------

```sh

# Install Cordova and Ionic
$ npm install -g cordova ionic

# Clone Repository
$ git clone https://github.com/labsterx/startupwatch-app.git
$ cd startupwatch-app
$ npm install

# To Build and test the iOS version
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios

# To Build and test the Android version
$ ionic platform add android
$ ionic build android
$ ionic emulate android

```

Author
------

**LabsterX**

* Website: http://www.labsterx.com
* Twitter: https://twitter.com/labsterx
* Github: https://github.com/labsterx

License
----

This app is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.