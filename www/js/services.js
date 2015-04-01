angular.module('starter.services', [])

    .factory('Buildings', function ($q, $timeout, $http) {
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

        var myLocation = {
            id: 'myLocation@9988',
            img: 'img/walking.png',
            name: 'Me',
            description: 'My current location',
            distance: 'unknown',
            coords: {
                latitude: 51.934,
                longitude: 9.105
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
            floors: [
                {
                    id: 211,
                    name: '1st Floor',
                    meetingRooms: [{
                        id: 21101,
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
                            id: 21102,
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
                }]
        }, {
            id: 2,
            name: 'Company Restaurant',
            description: 'The cantine is currently run by <a href="#app/menuplan">aramark</a> and serves hot and cold food for breakfast (08.30 - 10.00) and lunch (11.30 - 13.30)',
            img: 'img/restaurant.png',
            icon: 'ion-coffee',
            coords: {
                latitude: 51.933664,
                longitude: 9.106368
            }
        }, {
            id: 17,
            name: 'G17',
            description: 'Building 17 is the main Building for IT, CSNM and CEO, Mr. Stührenberg',
            img: 'img/factory.png',
            icon: 'ion-home',
            coords: {
                latitude: 51.934364,
                longitude: 9.108534
            },
            floors: [
                {
                    id: 171,
                    name: '1st Floor',
                    meetingRooms: [{
                        id: 17101,
                        name: 'G17 Room 101',
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
                            id: 17102,
                            name: 'G17 Room 102',
                            description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                            img: 'img/regroup.png',
                            icon: 'ion-ios-people',
                            floor: '1st',
                            coords: {
                                latitude: 51.934374,
                                longitude: 9.10870
                            }
                        },
                        {
                            id: 17103,
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
                },
                {
                    id: 172,
                    name: '2nd Floor',
                    meetingRooms: [{
                        id: 17201,
                        name: 'G17 Room 201',
                        description: 'A meeting room for up to 20 people. The room has a projector and audio capabilities',
                        img: 'img/regroup.png',
                        icon: 'ion-ios-people',
                        floor: '1st',
                        coords: {
                            latitude: 51.934284,
                            longitude: 9.10830
                        }
                    },
                        {
                            id: 17202,
                            name: 'G17 Room 202',
                            description: 'A meeting room for up to 8 people. The room has a projector and audio capabilities',
                            img: 'img/regroup.png',
                            icon: 'ion-ios-people',
                            floor: '1st',
                            coords: {
                                latitude: 51.934374,
                                longitude: 9.10870
                            }
                        }]
                }]

        }];

        var selectedBuilding = buildings[0];
        return {
            all: function () {
                return buildings;
            },
            get: function (buildingId) {
                var res = null;
                buildings.forEach(function (building) {
                    if (building.id === buildingId) {
                        selectedBuilding = building;
                        res = building;
                        return res;
                    } else {
                        // it may be a meeting room
                        if (building.floors) {
                            building.floors.forEach(function (floor) {
                                if (floor.meetingRooms) {
                                    floor.meetingRooms.forEach(function (room) {
                                        if (room.id == buildingId) {
                                            selectedBuilding = building;
                                            res = building;
                                            return res;
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                return res;
            },
            search: function (query) {
                var results = [];
                if (query) {
                    buildings.forEach(function (building) {

                        var re = new RegExp(query, 'gi');
                        if (building.name.search(re) > -1 || building.description.search(re) > -1) {
                            // console.log(building.name);
                            results.push(building);
                        }
                        if (building.floors) {
                            building.floors.forEach(function (floor) {
                                if (floor.meetingRooms) {
                                    floor.meetingRooms.forEach(function (room) {
                                        if (room.name.search(re) > -1 || room.description.search(re) > -1) {
                                            room.floorId = floor.id;
                                            results.push(room);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    results = buildings;
                    buildings.forEach(function (building) {
                        if (building.floors) {
                            building.floors.forEach(function (floor) {
                                if (floor.meetingRooms) {
                                    floor.meetingRooms.forEach(function (room) {
                                        results.push(room);
                                    });
                                }
                            });
                        }
                    });
                }
                return results;
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
            },
            getDistanceToBuilding: function () {
                if (selectedBuilding && myLocation) {
                    return calculateDistance(selectedBuilding.coords, myLocation.coords);
                }
                return 'unknown';
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


function toRad(value) {
    var RADIANT_CONSTANT = 0.0174532925199433;
    return (value * RADIANT_CONSTANT);
}

function calculateDistance(starting, ending) {
    var KM_RATIO = 6371;
    try {
        var dLat = toRad(ending.latitude - starting.latitude);
        var dLon = toRad(ending.longitude - starting.longitude);
        var lat1Rad = toRad(starting.latitude);
        var lat2Rad = toRad(ending.latitude);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = KM_RATIO * c;
        return d;
    } catch (e) {
        return -1;
    }
}