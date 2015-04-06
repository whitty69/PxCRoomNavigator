// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', [
    'ionic',
    'pascalprecht.translate',
    'starter.controllers',
    'starter.services',
    'uiGmapgoogle-maps',
])

    .run(function ($ionicPlatform, $translate, $log) {
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
            var translate = $translate('app_name');
            //console.log('ready ->' + translate.value);
            $log.debug(translate);
            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (language) {
                    $translate.use((language.value).split("-")[0]).then(function (data) {
                        $log.debug("SUCCESS -> " + data);
                    }, function (error) {
                        $log.debug("ERROR -> " + error);
                    });
                }, null);
            }
        });
        /*$http.get('data/initial_data_import.json').success (function(data){
         $log.debug(data);
         });
         */
        /*var centerPoint = localStorage.getItem("centerPoint");
         var buildings  = localStorage.getItem("buildings");
         $log.debug(centerPoint);
         $log.debug(buildings);

         if(!centerPoint) {
         localStorage.setItem("centerPoint", JSON.stringify(Buildings.getCampusCenter()));
         }else{

         }

         if(!buildings){
         localStorage.setItem("buildings", JSON.stringify(Buildings.all()));
         }
         */
    })


    .config(function ($stateProvider, $urlRouterProvider, $translateProvider, uiGmapGoogleMapApiProvider) {

        $translateProvider.translations('de', {
            app_name: 'Quick Room Finder',
            search_placeholder: 'Suchen',
            search_clear: 'Abbrechen',
            menu_map: 'Karte',
            menu_buildings: 'Gebaüde',
            menu_search: 'Suche',
            menu_settings: 'Einstellungen',
            menu_about: 'Information',
            menu_menuplan: 'Speiseplan',
            menu_choose_language: 'Sprache wählen',
            menu_language_de: 'Deutsch',
            menu_language_en: 'Englisch',
            map_distance: 'Entfernung zur Gebäude:'
        });
        $translateProvider.translations('en', {
            app_name: "Quick Room Finder",
            search_placeholder: 'Search',
            search_clear: 'Cancel',
            menu_map: 'Map',
            menu_buildings: 'Buildings',
            menu_search: 'Search',
            menu_settings: 'Settings',
            menu_about: 'About',
            menu_menuplan: 'Menu Plan',
            menu_choose_language: 'Choose Language',
            menu_language_de: 'German',
            menu_language_en: 'English',
            menu_about_text: 'This app is to be used in accordance with the rules of the road. The author is not be liable for any damage caused to person or property when using this app!',
            map_distance: 'Current Distance to building:'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage("en");
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
            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html',
                        controller: 'SettingsController'
                    }
                }
            })

        ;


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/map');

        // setup the google maps config
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCPJNT0sUAJo2vcYrjzexh9S7PzrqwSbFA',
            v: '3.17',
            libraries: 'weather,geometry,visualization,animation'
        })
    });


