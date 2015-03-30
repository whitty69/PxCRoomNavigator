angular.module('starter.services', [])

    .factory('Buildings', function () {
        // Might use a resource here that returns a JSON array
        // Some fake testing data
        var campusCenter = {
            control: {},
            center: {
                latitude: 51.933092,
                longitude: 9.107958
            },
            zoom: 16,
            options: {
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                streetViewControl: false,
                panControl: false,
                maxZoom: 25,
                minZoom: 3
            }
        };

        var buildings = [{
            id: 21,
            name: 'G21',
            description: 'Building 21 is the main entrance Building and is often referred to as the "Hochaus"',
            img: 'img/factory.png',
            icon: 'ion-home',
            coords: {
                latitude: 51.934863,
                longitude: 9.104763
            },
            meetingRooms: [{
                id: 101,
                name: 'G21 Room 101',
                description: 'A meeting room for up to 15 people. The room has a projector and audio capabilities',
                img: 'img/regroup.png',
                icon: 'ion-ios-people',
                floor: '1st',
                coords: {
                    latitude: 51.93478,
                    longitude: 9.10470
                }
            },
                {
                    id: 102,
                    name: 'G21 Room 102',
                    description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                    img: 'img/regroup.png',
                    icon: 'ion-ios-people',
                    floor: '1st',
                    coords: {
                        latitude: 51.934843,
                        longitude: 9.104663
                    }
                }]
        }, {
            id: 2,
            name: 'Company Restaurant',
            description: 'The cantine is currently run by <a href="http://www.aramark.com" target="_blank"> aramark </a> and serves hot and cold food for breakfast (08.30 - 10.00) and lunch (11.30 - 13.30)',
            img: 'img/restaurant.png',
            icon: 'ion-coffee',
            coords: {
                latitude: 51.933664,
                longitude: 9.106368
            }
        }, {
            id: 17,
            name: 'G17',
            description: 'Building 17 is the main Building for IT',
            img: 'img/factory.png',
            icon: 'ion-home',
            coords: {
                latitude: 51.934364,
                longitude: 9.108534
            },
            meetingRooms: [{
                id: 101,
                name: 'G17 Room 101',
                description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                img: 'img/regroup.png',
                icon: 'ion-ios-people',
                floor: '1st',
                coords: {
                    latitude: 51.934374,
                    longitude: 9.10870
                }
            }, {
                id: 102,
                name: 'G17 Room 102',
                description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                img: 'img/regroup.png',
                icon: 'ion-ios-people',
                floor: '1st',
                coords: {
                    latitude: 51.934284,
                    longitude: 9.10830
                }
            },
                {
                    id: 103,
                    name: 'G17 Room 103',
                    description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                    img: 'img/regroup.png',
                    icon: 'ion-ios-people',
                    floor: '1st',
                    coords: {
                        latitude: 51.93464,
                        longitude: 9.108780
                    }
                }]

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
