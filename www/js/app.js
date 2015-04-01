// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'starter.controllers',
    'starter.services',
    'uiGmapgoogle-maps',
])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });
    })


    .config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppController'
            })

            // Each tab has its own nav history stack:

            .state('app.map', {
                url: '/map',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapController'
                    }
                }
            })
            .state('app.mapselect', {
                url: '/mapselect/:buildingId&:floorId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/map.html',
                        controller: 'MapSelectController'
                    }
                }
            })
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchController'
                    }
                }
            })
            .state('app.buildings', {
                url: '/buildings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/buildings.html',
                        controller: 'BuildingsController'
                    }
                }
            })
            .state('app.menuplan', {
                url: '/menuplan',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/menuplan.html',
                        controller: 'MenuplanController'
                    }
                }
            })
            .state('app.about', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/about.html',
                        controller: 'AppController'
                    }
                }
            })

        ;


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/map');

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCPJNT0sUAJo2vcYrjzexh9S7PzrqwSbFA',
            v: '3.17',
            libraries: 'weather,geometry,visualization,animation'
        });

    });

