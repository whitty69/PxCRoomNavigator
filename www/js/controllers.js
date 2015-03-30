angular.module('starter.controllers', [])

    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, $interval, $cordovaGeolocation, $rootScope) {

        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function (maps) {
            prepareMapEvents($scope, Buildings, $cordovaGeolocation, $interval, $rootScope);
            $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), Buildings.getMyLocation(), $rootScope);
        });


    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, Buildings, $stateParams, $ionicLoading, $cordovaGeolocation, $interval, $rootScope) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: true
        });
        prepareMapEvents($scope, Buildings, $cordovaGeolocation, $interval, $rootScope);
        uiGmapGoogleMapApi.then(function (maps) {
            try {
                var building = Buildings.get($stateParams.buildingId);
                $scope.markers = prepMarkers($scope, building, Buildings.getMyLocation(), $rootScope);
                $scope.myLocation = Buildings.getMyLocation();
            } finally {
                $ionicLoading.hide();
            }
        });
    })

    .controller('AppController', function ($scope, $ionicLoading, uiGmapGoogleMapApi, Buildings) {

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
                        $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), Buildings.getMyLocation());
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

    .controller('SearchController', function ($scope, $ionicLoading, Buildings) {

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


function prepareMapEvents($scope, Buildings, $cordovaGeolocation, $interval, $rootScope) {
    if (!$scope.map) {
        $interval(function () {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                //latlong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude }
                console.log(position);
                var myLoc = {
                    id: 'myLocation@9988',
                    img: 'img/walking.png',
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                };
                Buildings.setMyLocation(myLoc);
                $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), myLoc);
                $rootScope.currentLocation = myLoc;
            }, function (err) {
                console.error(err);
            });
        }, 10000);
        $scope.map = Buildings.getCampusCenter();
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

function prepMarkers($scope, selectedBuilding, myLocation, $rootScope) {

    var markers = [selectedBuilding, myLocation];
    // add the meeting rooms
    if (selectedBuilding.meetingRooms) {
        selectedBuilding.meetingRooms.forEach(function (entry) {
            markers.push(entry);
        });
    }
    $scope.onMarkerClicked = function (model) {
        $rootScope.selectedMarker = model;
    };
    // set the onClicked listener
    markers.forEach(function (marker) {
        marker.onMarkerClicked = function () {
            $scope.onMarkerClicked(marker);
        };
    });
    return markers;
}