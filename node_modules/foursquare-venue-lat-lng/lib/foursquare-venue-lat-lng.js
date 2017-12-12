var request = require('request');

var Foursquare = function() {

};

Foursquare.prototype.getLatLng = function(pageUrl, cb) {
  request({
    url: pageUrl,
    timeout: 60000,
    jar: request.jar(),
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.65 Safari/537.31'
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var regularExpresionMatch = /daddr=(\d{1,}.\d{1,}),(-\d{1,}.\d{1,})/gi;
      var matchArray = body.match(regularExpresionMatch);
      if (matchArray && matchArray.length > 0) {
        var lat = matchArray[0].replace(regularExpresionMatch, '$1');
        var lng = matchArray[0].replace(regularExpresionMatch, '$2');
        cb(lat, lng);
      }
      else {
        cb(0, 0);
      }
    }
    else {
      cb(0, 0);
    }
  });
};

module.exports = Foursquare;
