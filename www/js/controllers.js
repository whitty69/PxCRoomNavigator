angular.module('starter.controllers', [])

    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, Map) {
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        var home = Buildings.get(21);
        $scope.map = {center: home, zoom: 18, options: {mapTypeId: google.maps.MapTypeId.SATELLITE}};
        $scope.selectedBuilding = home;
        Map.setMap($scope.map);
        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function (maps) {

        });


    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, Buildings, Map, $stateParams) {
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        var building = Buildings.get($stateParams.buildingId);
        $scope.map = {center: building, zoom: 18, options: {mapTypeId: google.maps.MapTypeId.SATELLITE}};
        $scope.selectedBuilding = building;
        //Map.setMap($scope.map);
        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.
        uiGmapGoogleMapApi.then(function (maps) {

        });


    })
    .controller('AppController', function ($scope, $ionicLoading, Map) {

        $scope.centerOnMe = function () {
            if (!Map.get()) {
                alert('No Map defined!');
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            var onSuccess = function (position) {
                try {
                    Map.get().center = position.coords;
                    $scope.$apply();
                } finally {
                    $ionicLoading.hide();
                }
            };

            function onError(error) {
                console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        };


    })

    .controller('SearchController', function ($scope, $ionicLoading, Buildings, Map) {

    })
    .controller('BuildingsController', function ($scope, $ionicLoading, Buildings, Map) {
        $scope.buildings = Buildings.all();
    })

;

