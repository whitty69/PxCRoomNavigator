angular.module('starter.controllers', [])

    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, $interval, $cordovaGeolocation, $timeout) {

        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        // The "then" callback function provides the google.maps object.
        $interval(function () {
            setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout);
        }, 10000);
        uiGmapGoogleMapApi.then(function (maps) {
            prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout);
            $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), Buildings.getMyLocation());
        });


    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, Buildings, $stateParams, $ionicLoading, $cordovaGeolocation, $timeout) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: true
        });
        prepareMapEvents($scope, Buildings, $cordovaGeolocation);
        uiGmapGoogleMapApi.then(function (maps) {
            try {
                var buildingId = parseInt($stateParams.buildingId);
                var building = Buildings.get(buildingId);
                if (building) {
                    $scope.markers = prepMarkers($scope, building, Buildings.getMyLocation(), buildingId, $timeout);
                }
                $scope.myLocation = Buildings.getMyLocation();
            } finally {
                $ionicLoading.hide();
            }
        });
    })

    .controller('AppController', function ($scope, $ionicLoading, uiGmapGoogleMapApi, Buildings, $timeout) {

        $scope.centerOnMe = function () {

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: true
            });
            //$scope.map = Buildings.getCampusCenter();
            var onSuccess = function (position) {
                uiGmapGoogleMapApi.then(function (maps) {
                    try {
                        var myLoc = {
                            id: 'myLocation@9988',
                            img: 'img/walking.png',
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        };
                        //$scope.map.center = myLoc.coords;
                        $scope.myLocation = myLoc;
                        Buildings.setMyLocation(myLoc);
                        $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), Buildings.getMyLocation(), -1, $timeout);
                        //maps.refresh();
                    } finally {
                        $ionicLoading.hide();
                    }
                });
            };

            function onError(error) {
                console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                $ionicLoading.hide();
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        };


    })

    .controller('SearchController', function ($scope, Buildings) {
        var doSearch = ionic.debounce(function (query) {
            var results = [];
            var buildings = Buildings.all();
            if (query) {
                buildings.forEach(function (building) {

                    var re = new RegExp(query, 'gi');
                    if (building.name.search(re) > -1 || building.description.search(re) > -1) {
                        console.log(building.name);
                        results.push(building);
                    }
                    if (building.meetingRooms) {
                        building.meetingRooms.forEach(function (room) {
                            if (room.name.search(re) > -1 || room.description.search(re) > -1) {
                                console.log(room.name);
                                results.push(room);
                            }
                        });
                    }
                });
            } else {
                results = buildings;
                buildings.forEach(function (building) {

                    if (building.meetingRooms) {
                        building.meetingRooms.forEach(function (room) {
                            results.push(room);
                        });
                    }
                });
            }
            $scope.searchResults = results;
            $scope.$apply();
        }, 500);

        $scope.search = function () {
            doSearch($scope.query);
        }
    })


    .controller('BuildingsController', function ($scope, $ionicLoading, Buildings) {
        $scope.buildings = Buildings.all();
    })

    .controller('InfoController', function ($scope, $log) {
        $scope.templateValue = 'hello from the template itself';
        $scope.clickedButtonInWindow = function () {
            var msg = 'clicked a window in the template!';
            console.log(msg);
        }
    });
function setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        //latlong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude }

        var myLoc = {
            id: 'myLocation@9988',
            img: 'img/walking.png',
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
        };
        Buildings.setMyLocation(myLoc);
        var selectedBuilding = Buildings.getSelectedBuilding();
        if (selectedBuilding) {
            $scope.markers = prepMarkers($scope, selectedBuilding, myLoc, -1, $timeout);
        }
        $scope.currentLocation = myLoc;
    }, function (err) {
        console.error(err);
    });
}

function prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout) {
    if (!$scope.map) {
        $scope.map = Buildings.getCampusCenter();
        setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout);
    }

    if (!$scope.map.events) {
        $scope.map.clickedMarker = {
            id: 0,
            title: 'You clicked here',
            geometry: {
                type: "Point",
                coordinates: []
            }
        };
        $scope.map.events = {
            tilesloaded: function (map, eventName, originalEventArgs) {
            }
            ,
            click: function (mapModel, eventName, originalEventArgs) {
                // 'this' is the directive's scope
                console.log("user defined event: " + eventName, mapModel, originalEventArgs);

                var e = originalEventArgs[0];
                $scope.map.clickedMarker = {
                    id: 0,
                    title: 'You clicked here ' + 'lat: ' + e.latLng.lng() + ' lon: ' + e.latLng.lng(),
                    geometry: {
                        type: "Point",
                        coordinates: [e.latLng.lng(), e.latLng.lat()]
                    }
                };
                //scope apply required because this event handler is outside of the angular domain
                $scope.$apply();
            }
        };
    }
}


function prepMarkers($scope, selectedBuilding, myLocation, selectedId, $timeout) {

    var markers = [];

    if (selectedBuilding) {
        markers.push(selectedBuilding)
    }
    // add the meeting rooms
    if (selectedBuilding.meetingRooms) {
        selectedBuilding.meetingRooms.forEach(function (entry) {
            markers.push(entry);
        });
    }
    if (myLocation) {
        markers.push(myLocation)
    }
    $scope.onMarkerClicked = function (model) {
        $scope.selectedMarker = model;
    };
    // set the onClicked listener
    markers.forEach(function (marker) {
        marker.onMarkerClicked = function () {
            $scope.onMarkerClicked(marker);
        };

        if (marker.id === selectedId) {
            console.log(marker.name);
            $timeout(function () {
                marker.options = {
                    animation: google.maps.Animation.BOUNCE
                };
                $scope.$apply();
            }, 400);
        }
    });
    return markers;
}