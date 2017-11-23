var rp = require("request-promise");
var request = require("request");
var GoogleApi = require("../../config/endpoints").GOOGLE;
var GoogleMapsApi = require("../../config/endpoints").GOOGLE_MAPS;
var createQueryParameter = require("../utils/endpoints").createQueryParameter;

function GooglePlacesService (apiKey, mapsKey) {
  var self  = this;
  this.getLatLonFromZip = function(zipcode) {
  // Get latitude and longitude
    return rp (GoogleMapsApi + createQueryParameter("address", zipcode, true) + createQueryParameter("key", mapsKey))
    .then((resp) =>  JSON.parse(resp))
    .then((json) => {
      latlng = json.results[0].geometry.location
      return json.results[0].geometry.location
    });
  }


  this.searchPlacesByZip = function (zipcode, category) {
    return this.getLatLonFromZip(zipcode)
    .then((latln) => {
      return generateSearchUrl (latln, category);
    })
    .then((rp))
    .then((resp) => JSON.parse(resp));
  }


  function placeIdSearchUtility (reqUrl, places, cb, ecb) {
    // console.log("called");
    // console.log(reqUrl);
      console.log(reqUrl);
      request(reqUrl, function(error, response, body) {

          var json = JSON.parse(body);
          var placeids = extractResultPlaceIds(json.results).concat(places);
          if (json.next_page_token) {
            var nextPage = generateSearchUrl(null, null, json.next_page_token);
            // console.log(nextPage);
              setTimeout(function() {
            placeIdSearchUtility(nextPage, placeids, cb, ecb);
            }, 3000);
          }
          else {
            cb(placeids);
          }

    });
  }


  this.getPlaceIdsByZip = function (zipcode, category) {
    return new Promise((resolve, reject) => {
      self.getLatLonFromZip(zipcode).then((latlng) => {
        placeIdSearchUtility((generateSearchUrl(latlng, category)), [], function(places) {
          resolve(places);
        }, function(error) { reject(error); });
      // this.searchPlacesByZip(zipcode, category).then((resp) => {
      //    resolve(extractResultPlaceIds(resp.results));
      // }).catch((e) => {reject(e)});
    }).catch((e) => {
      reject(e);
    });
    });
  }

  function extractResultPlaceIds (results) {
    // console.log(results);
    var placeids = [];
    // console.log(results);
    for (var i=0; i<results.length; i++) {
      placeids.push(results[i].place_id);
    }
    return placeids;
  }


  function generateSearchUrl (latln, category, nextPage) {
    var uri = GoogleApi + createQueryParameter("key", apiKey, true);
    if (!nextPage)  uri  +=  createQueryParameter("radius", "50000") + createQueryParameter("type", category) +  createQueryParameter("location", latln.lat + "," + latln.lng);
    else uri += createQueryParameter("pagetoken", nextPage);
    // console.log("THE URI IS " + uri);
    return uri;
  }


}
module.exports = GooglePlacesService;
