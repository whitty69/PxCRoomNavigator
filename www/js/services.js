angular.module('starter.services', [])

    .factory('Buildings', function () {
        // Might use a resource here that returns a JSON array
        // Some fake testing data
        var campusCenter = {
            center: {
                latitude: 51.933092,
                longitude: 9.107958
            },
            zoom: 10,
            options: {
                mapTypeId: google.maps.MapTypeId.SATELLITE
            }
        };

        var buildings = [{
            id: 21,
            name: 'G21',
            img: 'img/factory.png',
            icon: 'ion-home',
            coords: {
                latitude: 51.934863,
                longitude: 9.104763
            }
        }, {
            id: 2,
            name: 'Company Restaurant',
            img: 'img/restaurant.png',
            icon: 'ion-coffee',
            coords: {
                latitude: 51.933664,
                longitude: 9.106368
            }
        }, {
            id: 17,
            name: 'G17',
            img: 'img/factory.png',
            icon: 'ion-home',
            coords: {
                latitude: 51.934364,
                longitude: 9.108534
            }
        }];

        var myLocation = {
            id: 'myLocation@9988',
            img: 'img/walking.png',
            coords: {
                latitude: buildings[0].coords.latitude - 0.0002,
                longitude: buildings[0].coords.longitude - 0.0002
            }
        };

        var selectedBuilding = buildings[0];

        return {
            all: function () {
                return buildings;
            },
            get: function (buildingId) {
                for (var i = 0; i < buildings.length; i++) {
                    if (buildings[i].id === parseInt(buildingId)) {
                        selectedBuilding = buildings[i];
                        return buildings[i];
                    }
                }
                return null;
            },
            getCampusCenter: function () {
                return campusCenter
            },
            getMyLocation: function () {
                return myLocation;
            },
            setMyLocation: function (location) {
                myLocation = location;
            },
            getSelectedBuilding: function () {
                return selectedBuilding;
            }

        };
    })
    .factory('$cordovaGeolocation', ['$q', function ($q) {

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
    }]);
