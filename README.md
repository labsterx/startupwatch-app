Startup Watch
=========

Startup Watch is a mobile app that provides information on startup companies around the world, including startup company profiles, startup job search etc. The information is provided by [AngelList](https://angel.co).

This app is an HTML5 hybrid app developed using the [Ionic Framework](http://ionicframework.com/), which is optimized for AngularJS. 

The data source for this app is the [AngelList API](https://angel.co/api).


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