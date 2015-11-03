angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MapCtrl', function($scope, $http, MAPBOX, $cordovaGeolocation) {
  var vm = this;

  vm.coverageFeatures = [];




  L.mapbox.accessToken = MAPBOX.TOKEN;
    var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([40, -74.50], 9)
      .addControl(L.mapbox.geocoderControl('mapbox.places', {
      autocomplete: true
    }));

    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        console.log(position);
        var lat  = position.coords.latitude
        var lng = position.coords.longitude
        L.marker([lat, lng]).addTo(map);
      }, function(err) {
        // error
      });

   $scope.coveragePromise = $http.get('http://localhost:9000/api/coverages')
    .then(function(coveragePoints) {
      vm.coverageFeatures = coveragePoints.data.features;
      $scope.coveragePoints = L.geoJson(self.coverageFeatures, {
          style: function (feature) {
              return {color: feature.properties.color};
          },
          onEachFeature: function (feature, layer) {
            console.log(feature);
              layer.bindPopup(feature.properties.wifi[0].signal_level);
          }
      }).addTo(map);



    }).
    catch(function(ex){
      console.log(ex);
    })

  //On click get interment data
  map.on('click', function(e) {
  
        var data= {
            "type": "Feature",
            "properties": {
              "address": "222 Test St",
              "floor": 1,
              "room": "Office"
            },
            "geometry": {
                 "type":  "Point" ,
                 "coordinates": [
                    e.latlng.lng,
                    e.latlng.lat
                  ]
            }
         };

       $http.post('http://localhost:9000/api/coverages', data)
         .then(function(cov) {
           console.log(cov);
         });
  });

})

.controller('AccountCtrl', function($scope) {
  $scope.states;
  $scope.settings = {
    enableFriends: true
  };
  checkConnection();

  function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    $scope.states = states;
}


});
