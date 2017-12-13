var myLocations = [{
        name: "BAM Harvey Theater",
        lat: 40.6884270,
        long: -73.9787920
        },
    {
        name: "BRIC House",
        lat: 40.688870,
        long: -73.979151
    },
    {
        name: "Atlantic Terminal",
        lat: 40.685096,
        long: -73.977691
},
    {
        name: "Beacon\'s Closet Park Slope",
        lat: 40.680306,
        long: -73.978097
},
    {
        name: 'Barclays Center',
        lat: 40.682682,
        long: -73.975035
}
];


// strict mode Global variables
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

    // Infowindow with location info
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>";


    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    // Foursquare api Authenticatification using the clientid I registered with.
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20000607 ' + '&query=' + this.name;

    $.getJSON(foursquareURL).done(function (data) {
        var results = data.response.venues[0];

        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];

    }).fail(function () {
        alert("There was an error with the Foursquare API call. Please refresh the page.");
    });
    // Infowindow with street and city information
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>"
    this.infoWindow = new google.maps.InfoWindow({
        content: self.contentString
    });

    // Setting markers on Map
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

        // this gives the bouncing affect of the pointer on the map. 
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
    //This is where the map will originate
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {
            lat: 40.687074,
            lng: -73.976294
        }
    });

    // unique foursquare api keys 
    clientID = "LHIMRI5U4GYF23SHGQKRN2FPLXDNV20K0S0PWZNW12ZVCD3S";
    clientSecret = "K35I1X0SHF5KTNLVDS5MY1SRKCTGUON23N2EQUIYEZDR31ZQ";

    myLocations.forEach(function (locationItem) {
        self.locationList.push(new Location(locationItem));
    });
    // search list filter
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
// this function will run in an effort to alert the user if there's an error loading my map
function errorHandling() {
    alert("Google Maps failed to load the requested page. Please refresh the page.");
}
