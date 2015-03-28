angular.module('starter.services', [])

    .factory('Buildings', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var buildings = [{
            id: 0,
            name: 'G21',
            latitude: 51.934851,
            longitude: 9.104664
        }];

        return {
            all: function () {
                return buildings;
            },
            remove: function (building) {
                buildings.splice(buildings.indexOf(building), 1);
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
