function setOverlay(map, $scope, $log) {
    var swBound = new google.maps.LatLng(51.927429, 9.100171); // south west
    var neBound = new google.maps.LatLng(51.938204, 9.112544); // north east
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = 'img/overlay_img.png';
    $log.debug(map);
    $scope.overlay = new USGSOverlay(bounds, srcImage, map);

}
angular.module('starter.controllers', [])


    .controller('MapController', function ($scope, uiGmapIsReady, uiGmapGoogleMapApi, Buildings, $interval, $cordovaGeolocation, $timeout, $log) {

        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []
        // The "then" callback function provides the google.maps object.
        // get the lookup for position running
        $interval(function () {
            setMyLocation($scope, Buildings, $cordovaGeolocation, $timeout);
        }, 10000);
        uiGmapGoogleMapApi.then(function (maps) {
            prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout, $log);
            $scope.meMarkers = [Buildings.getMyLocation()];
            $scope.markers = prepMarkers($scope, Buildings.getSelectedBuilding(), -1, $timeout, -1);
            return maps;
        });
        uiGmapIsReady.promise()                     // this gets all (ready) map instances - defaults to 1 for the first map
            .then(function(instances) {                 // instances is an array object
               // $scope.map.control = instances[0].map;
                setOverlay(instances[0].map, $scope, $log);
            });
    })
    .controller('MapSelectController', function ($scope, uiGmapGoogleMapApi, uiGmapIsReady, Buildings, $stateParams, $ionicLoading, $cordovaGeolocation, $timeout, $log) {
        //console.log($stateParams.floorId);
        //console.log($stateParams.buildingId);

        prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout, $log);
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
            return maps;
        });
        uiGmapIsReady.promise()                     // this gets all (ready) map instances - defaults to 1 for the first map
            .then(function(instances) {                 // instances is an array object
                setOverlay(instances[0].map, $scope, $log);
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

    .controller('SearchController', function ($scope, Buildings, $log) {
        var doSearch = ionic.debounce(function (query) {
            $scope.searchResults = Buildings.search(query);
            $log.debug("searching for " + query);
            $scope.$apply();
        }, 500);

        $scope.search = function () {
            doSearch($scope.query);
        };

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

function prepareMapEvents($scope, Buildings, $cordovaGeolocation, $timeout, $log) {
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
                //scope apply required because this
                // event handler is outside of the angular domain
                $log.debug($scope.map.clickedMarker.title);
                $scope.$apply();
            }
        };

    }
}


function prepMarkers($scope, selectedBuilding, selectedId, $timeout, floorId) {

    var markers = [];

    if (selectedBuilding) {
        markers.push(selectedBuilding);
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
    }

    $scope.onMarkerClicked = function (model) {
        var marker = model.model;
        $scope.selectedMarker = marker;
        model.showWindow = null;
        $scope.$apply();
    };
    // set the onClicked listener
    markers.forEach(function (marker) {
        // add a markerclicked event
        marker.onMarkerClicked = function () {
            $scope.onMarkerClicked(marker);
        };

        marker.closeClick = function () {
            marker.showWindow = false;
        };

        marker.options = {animation: google.maps.Animation.NONE};

        if (marker.showWindow === true) {
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


// Initialize the map and the custom overlay.

USGSOverlay.prototype = new google.maps.OverlayView();
/** @constructor */
function USGSOverlay(bounds, image, map) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
USGSOverlay.prototype.onAdd = function() {

    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    var r = 'rotate(-10deg)';
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    img.style.opacity = '0.7';
    img.style.transform = r;
    div.appendChild(img);

    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(div);
};

USGSOverlay.prototype.draw = function() {

    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};

// [START region_hideshow]
// Set the visibility to 'hidden' or 'visible'.
USGSOverlay.prototype.hide = function() {
    if (this.div_) {
        // The visibility property must be a string enclosed in quotes.
        this.div_.style.visibility = 'hidden';
    }
};

USGSOverlay.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = 'visible';
    }
};

USGSOverlay.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility == 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    }
};

// Detach the map from the DOM via toggleDOM().
// Note that if we later reattach the map, it will be visible again,
// because the containing <div> is recreated in the overlay's onAdd() method.
USGSOverlay.prototype.toggleDOM = function() {
    if (this.getMap()) {
        // Note: setMap(null) calls OverlayView.onRemove()
        this.setMap(null);
    } else {
        this.setMap(this.map_);
    }
};