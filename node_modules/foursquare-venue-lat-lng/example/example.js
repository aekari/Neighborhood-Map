var Foursquare = require('../lib/foursquare-venue-lat-lng');
var foursquare = new Foursquare();

foursquare.getLatLng('https://es.foursquare.com/v/atomic-pizza/52fa5ad6498e8d4b57413406', function(lat, lng) {
  console.log(lat);
  console.log(lng);
});
