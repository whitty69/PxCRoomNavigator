angular.module('starter.controllers', [])

    .controller('MapController', function ($scope, uiGmapGoogleMapApi, Buildings, Map) {
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        var home = Buildings.get(0);
        $scope.map = {center: home, zoom: 15};
        $scope.selectedBuilding = home;
        Map.setMap($scope.map);
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
            //
            //navigator.geolocation.getCurrentPosition(function (pos) {
            //    $scope.map = {center: pos.coords, zoom: 18};
            //    $ionicLoading.hide();
            //    console.log(pos);
            //}, function (error) {
            //    alert('Unable to get location: ' + error.message);
            //});

            //$scope.map = {center: $scope.selectedBuilding, zoom: 15};

            var onSuccess = function (position) {
                try {
                    Map.get().center = position.coords;
                    $scope.$apply();
                    console.log(position);
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

    });

