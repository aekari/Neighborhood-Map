var initialLocations = [{
            name: "BAM Harvey Theater",
            //      position: {
            lat: 40.6884270,
            lng: -73.9787920
        },
        //id: "49b6a827f964a5200e531fe3"
    },
    {
        name: "BRIC House",
        //        position: {

        lat: 40.688870,
        lng: -73.979151
    },
    //id: "4a81c28df964a5207af71fe3"
}, {
    name: "Atlantic Terminal",
    //       position: {
    lat: 40.685096,
    lng: -73.977691
},
//id: "43fa07c9f964a520d92f1fe3"
}, {
    name: "Beacon\'s Closet Park Slope",
    //        position: {
    lat: 40.680306,
    lng: -73.978097
},
//id: "4a5e13d1f964a520ffbd1fe3"
}, {
    name: 'Barclays Center',
    //       position: {
    lat: 40.682682,
    lng: -73.975035
},
//id: "4b992b04f964a520726635e3"
}
];


// Global variables for strict mode.
var map;
var clientID;
var clientSecret;

var Location = function (data) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.street = "";
    this.city = "";

    this.visible = ko.observable(true);




    //Infowindow for street/city info
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>";


    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });
    //The '&V=..." is used for version control. It is a YYYYMMDD format.
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170607' + '&query=' + this.name;

    $.getJSON(foursquareURL).done(function (data) {
        var results = data.response.venues[0];

        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];

    }).fail(function () {
        alert("There was an error with the Foursquare API call. Please refresh the page and try again.");
    });

    // Infowindow containing the street and city info.
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>"
    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    // This sets the markers on the map.
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    this.showMarker = ko.computed(function () {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    this.marker.addListener('click', function () {
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content">' + self.street + "</div>" +
            '<div class="content">' + self.city + "</div>";


        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);

        // Creates the bouncing animation for the marker. 
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            self.marker.setAnimation(null);
        }, 2100);
    });

    this.bounce = function (place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

function AppViewModel() {
    var self = this;

    this.searchTerm = ko.observable("");

    this.locationList = ko.observableArray([]);
    //This is where the map will originate.
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {
            lat: 40.687074,
            lng: -73.976294
        }
    });

    // foursquare api settings. 
    clientID = "LHIMRI5U4GYF23SHGQKRN2FPLXDNV20K0S0PWZNW12ZVCD3S";
    clientSecret = "K35I1X0SHF5KTNLVDS5MY1SRKCTGUON23N2EQUIYEZDR31ZQ";

    initialLocations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));
    });
    // Filtering for search list. 
    this.filteredList = ko.computed(function () {
        var filter = self.searchTerm().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function (locationItem) {
                locationItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function (locationItem) {
                var string = locationItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
        }
    }, self);

    this.mapElem = document.getElementById('map');
    this.mapElem.style.height = window.innerHeight - 50;
}

function startApp() {
    ko.applyBindings(new AppViewModel());
}
// If there's an error with the map this function will run.
function errorHandling() {
    alert("Google Maps failed to load the requested page. Please try again.");
}
