angular.module('starter.controllers', [])

    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, $interval, $cordovaGeolocation, $rootScope) {

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
                $scope.markers = [Buildings.getSelectedBuilding(), myLoc];
                $rootScope.currentLocation = myLoc;
            }, function (err) {
                console.error(err);
            });
        }, 10000);
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function (maps) {

            $scope.map = Buildings.getCampusCenter();
            $scope.markers = [Buildings.getSelectedBuilding()];
            // set initial location
        });


    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, Buildings, $stateParams, $ionicLoading) {
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: true
        });
        $scope.map = Buildings.getCampusCenter();
        uiGmapGoogleMapApi.then(function (maps) {
            try {
//                $scope.map = Buildings.getCampusCenter();
                var building = Buildings.get($stateParams.buildingId);
                $scope.markers = [building, Buildings.getMyLocation()];
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
            $scope.map = Buildings.getCampusCenter();
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
                        $scope.map.center = myLoc.coords;
                        $scope.myLocation = myLoc;
                        Buildings.setMyLocation(myLoc);
                        $scope.markers = [Buildings.getSelectedBuilding(), Buildings.getMyLocation()];
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
    });


