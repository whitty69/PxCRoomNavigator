angular.module('starter.services', [])

    .factory('Buildings', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var buildings = [{
            id: 21,
            name: 'G21',
            icon: 'ion-home',
            latitude: 51.934863,
            longitude: 9.104763
        }, {
            id: 2,
            name: 'Company Restaurant',
            icon: 'ion-coffee',
            latitude: 51.933664,
            longitude: 9.106368
        }, {
            id: 17,
            name: 'G17',
            icon: 'ion-home',
            latitude: 51.934364,
            longitude: 9.108534
        }];

        return {
            all: function () {
                return buildings;
            },
            get: function (buildingId) {
                for (var i = 0; i < buildings.length; i++) {
                    if (buildings[i].id === parseInt(buildingId)) {
                        return buildings[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('Map', function () {

        var map;

        return {
            get: function () {
                return map;
            },
            setMap: function (mapi) {
                map = mapi;
            }
        };
    });
