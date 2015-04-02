angular.module('starter.controllers', [])


    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, $interval, $cordovaGeolocation, $timeout, $translate, $log) {

        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        // The "then" callback function provides the google.maps object.
        $interval(function () {
            setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout);
        }, 10000);
        uiGmapGoogleMapApi.then(function (maps) {
            prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout);
            $scope.meMarkers = [Buildings.getMyLocation()];
            $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), -1, $timeout, -1);
        });

        $translate(['app_name'])
            .then(function (translation) {
                $log.debug(translation.app_name);
            });
        // translate instantly from the internal state of loaded translation
        $log.debug($translate.instant('app_name'));
    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, Buildings, $stateParams, $ionicLoading, $cordovaGeolocation, $timeout) {
        //console.log($stateParams.floorId);
        //console.log($stateParams.buildingId);

        prepareMapEvents($scope, Buildings, $cordovaGeolocation);
        uiGmapGoogleMapApi.then(function (maps) {
            try {
                var buildingId = parseInt($stateParams.buildingId);
                var floorId = parseInt($stateParams.floorId);
                var building = Buildings.get(buildingId);
                if (building) {
                    $scope.markers = prepMarkers($scope, building, buildingId, $timeout, floorId);
                }
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
                        $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), -1, $timeout, -1);
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

            $scope.searchResults = Buildings.search(query);
            $scope.$apply();
        }, 500);

        $scope.search = function () {
            doSearch($scope.query);
        };
        ;

        $scope.cancel = function () {
            console.log('cancel');
            $scope.query = '';
            $scope.searchResults = [];
        }
    })


    .controller('BuildingsController', function ($scope, $ionicLoading, Buildings) {
        $scope.buildings = Buildings.all();
    })

    .controller('MenuplanController', function ($scope, $log) {
        $scope.date = new Date();
        $scope.menus = [
            {
                name: 'Currywurst & Pommes',
                description: 'Lovely Bratwurst covered in Curry ketchup served with a portion of chips!',
                icon: 'img/menus/currywurst.jpg',
                price: '€3.50'
            },
            {
                name: 'Salad Buffet',
                description: 'A wide range of fresh salad to choose from.',
                icon: 'img/menus/salad.jpg',
                price: '€0.50/100g'
            }
        ];
    })

    .controller('SettingsController', function ($scope, $translate, $log) {

        $scope.languages = [
            {
                text: 'menu_language_de',
                icon: '/img/german_flag.jpg',
                value: 'de'
            },
            {
                text: 'menu_language_en',
                icon: '/img/english_flag.jpg',
                value: 'en'
            }];

        $scope.data = {language: $translate.use().split('_')[0]};

        $log.debug('Current Language = ' + $scope.data.language);

        $scope.changeLang = function (key) {
            $translate.use(key).then(function (key) {
                $log.debug('Language changed to ' + key);
                //$scope.$apply();
            }, function (key) {
                $log.error("error occurred");
            });
        };
    });
function setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        var myLoc = Buildings.getMyLocation();
        myLoc.coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
        };
        Buildings.setMyLocation(myLoc);
        myLoc.distance = Buildings.getDistanceToBuilding();
        $scope.meMarkers = [myLoc];
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
                // console.log("user defined event: " + eventName, mapModel, originalEventArgs);

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


function prepMarkers($scope, selectedBuilding, selectedId, $timeout, floorId) {

    //console.log("prepare markers - in")
    var markers = [];

    if (selectedBuilding) {
        markers.push(selectedBuilding)
    }
    // add the meeting rooms
    if (floorId > 0 && selectedBuilding.floors) {
        selectedBuilding.floors.forEach(function (floor) {
            if (floor.id == floorId && floor.meetingRooms) {
                floor.meetingRooms.forEach(function (entry) {
                    //console.log(entry.id);
                    markers.push(entry);
                });
            }
        });
    }
    //if (myLocation) {
    //    myLocation.name = 'Me';
    //    myLocation.description = 'I am currently here.';
    //    markers.push(myLocation)
    //}
    $scope.onMarkerClicked = function (model) {
        var marker = model.model;
        $scope.selectedMarker = marker;
        model.showWindow = null;
        $scope.$apply();

    };
    // set the onClicked listener
    markers.forEach(function (marker) {
        marker.onMarkerClicked = function () {
            $scope.onMarkerClicked(marker);
        };

        marker.closeClick = function () {
            marker.showWindow = null;
        };

        marker.options = {animation: google.maps.Animation.NONE};
        if (marker.showWindow) {
            marker.showWindow = false;
        }
        if (marker.id === selectedId) {
            $timeout(function () {
                marker.showWindow = true;
                marker.options = {
                    animation: google.maps.Animation.BOUNCE
                };
                $scope.$apply();
            }, 400);
        }
    });
    return markers;
}