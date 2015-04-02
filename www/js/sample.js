/**
 * Created by pete on 29/03/15.
 */
var ionicApp = angular.module('ionicApp', ['ionic', 'uiGmapgoogle-maps']);

ionicApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBvHPUMbKIkIC6FPweEXCQoxUZO8XKI2u4',
        v: '3.17',
        libraries: 'geometry'
    });

    $urlRouterProvider.otherwise('/tab/alerts');

    $stateProvider
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/settings.html"
        })

        .state('tab.alerts', {
            url: '/alerts',
            views: {
                // the main template will be placed here (relatively named)
                'alerts': {
                    templateUrl: 'templates/alerts.html',
                }
            }
        })

}).factory('$cordovaGeolocation', ['$q', function ($q) {

    return {
        getCurrentPosition: function (options) {
            var q = $q.defer();

            navigator.geolocation.getCurrentPosition(function (result) {
                // Do any magic you need
                q.resolve(result);
            }, function (err) {
                q.reject(err);
            }, options);

            return q.promise;
        },
        watchPosition: function (options) {
            var q = $q.defer();

            var watchId = navigator.geolocation.watchPosition(function (result) {
                // Do any magic you need
                q.notify(result);

            }, function (err) {
                q.reject(err);
            }, options);

            return {
                watchId: watchId,
                promise: q.promise
            }
        },

        clearWatch: function (watchID) {
            return navigator.geolocation.clearWatch(watchID);
        }
    }
}])

    .controller('MyCtrl', function ($scope, $ionicSideMenuDelegate, uiGmapGoogleMapApi, $interval, $cordovaGeolocation, $rootScope) {

        $interval(function () {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(options).then(function (pos) {
                latlong = {'lat': pos.coords.latitude, 'long': pos.coords.longitude};
                $rootScope.currentLocation = latlong;
                console.log(pos);
            }, function (err) {

            });
        }, 5000);


        uiGmapGoogleMapApi.then(function (maps) {
            $scope.map = {
                "center": {
                    "latitude": 51.844943699999995,
                    "longitude": 4.3069723
                },
                "options": {
                    "zoomControl": false,
                    "minZoom": 13,
                    "maxZoom": 20,
                    "mapTypeControl": false,
                    "streetViewControl": false,
                    "draggable": true,
                    "panControl": false,
                    "optimized": true,
                    "mapTypeId": "roadmap",
                    "styles": [
                        {
                            "featureType": "poi",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "transit",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "landscape",
                            "stylers": [
                                {
                                    "visibility": "simplified"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "stylers": [
                                {
                                    "color": "#5f94ff"
                                },
                                {
                                    "lightness": 26
                                },
                                {
                                    "gamma": 5.86
                                }
                            ]
                        },
                        {},
                        {
                            "featureType": "road.highway",
                            "stylers": [
                                {
                                    "weight": 0.6
                                },
                                {
                                    "saturation": -85
                                },
                                {
                                    "lightness": 61
                                }
                            ]
                        },
                        {
                            "featureType": "road"
                        },
                        {},
                        {
                            "featureType": "landscape",
                            "stylers": [
                                {
                                    "hue": "#0066ff"
                                },
                                {
                                    "saturation": 74
                                },
                                {
                                    "lightness": 100
                                }
                            ]
                        }
                    ]
                },
                "zoom": 13,
                "events": {},
                "clusterOptions": {
                    "minimumClusterSize": 5,
                    "styles": [
                        {
                            "height": 53,
                            "url": "img/markers/cluster_marker_53.png",
                            "width": 53
                        },
                        {
                            "height": 56,
                            "url": "img/markers/cluster_marker_56.png",
                            "width": 56
                        },
                        {
                            "height": 66,
                            "url": "img/markers/cluster_marker_66.png",
                            "width": 66
                        }
                    ]
                }
            };
            $scope.map.markers = [
                {
                    "id": "50651",
                    "latitude": 51.8477469,
                    "longitude": 4.3141634,
                    "title": "Zorgambulance met spoed naar W. Plokkerstraat in Spijkenisse",
                    "distance": "585m",
                    "hoofdcat": "70",
                    "img": "http://snm-crm.nl/wealert/img/70/ambu_6_thumb.jpg?2u",
                    "reactiecount": "0",
                    "likecount": "0",
                    "showWindow": false,
                    "date": "2u",
                    "options": {
                        "labelContent": "&nbsp;&nbsp;&nbsp;585m<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2u",
                        "labelAnchor": "0 0",
                        "labelClass": "labelClass",
                        "animation": 1
                    }
                }
            ];
            function showMarkers(map) {
                $scope.map.markers = [];
                $scope.map.markers = [
                    {
                        "id": "50651",
                        "latitude": 51.8477469,
                        "longitude": 4.3141634,
                        "title": "Zorgambulance met spoed naar W. Plokkerstraat in Spijkenisse",
                        "distance": "585m",
                        "hoofdcat": "70",
                        "img": "http://snm-crm.nl/wealert/img/70/ambu_6_thumb.jpg?2u",
                        "reactiecount": "0",
                        "likecount": "0",
                        "showWindow": false,
                        "date": "2u",
                        "options": {
                            "labelContent": "&nbsp;&nbsp;&nbsp;585m<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2u",
                            "labelAnchor": "0 0",
                            "labelClass": "labelClass",
                            "animation": 1
                        }
                    }
                ]
            }

        })

    });



