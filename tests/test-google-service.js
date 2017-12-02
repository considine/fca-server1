require("assert");
var request = require("request");
var GoogleService = require("../lib/services/googleplaces-service");
var GoogleApiKey = require("../config/.env/keys").GOOGLE_PLACES_API_KEY;
var GoogleMaps = require("../config/.env/keys").GOOGLE_MAPS_API_KEY;


var ZipLocationService = require("zipcode-location-service");
var gs;
var category = "car_repair";
describe("GoogleService", function() {
  before(function() {
    gs = new GoogleService(GoogleApiKey, GoogleMaps);

  });

  describe("#getPlacesByZip()", function() {
    it("should return a list of placeids", function(done) {
      gs.getPlaceIdsByLoc(ZipLocationService.getLocation(60091), category)
      .then((resp) => {
        console.log(resp);
        done();
      })
      .catch((e) => {
        done(e);
      })
    });


    it ("should return a list of placeids", function (done) {
      // done();
      gs.getPlacesByLocation("60091", category).then((results) => {
        done();
      }).catch((e) => done(e));
    });
  });
  //
  // it("should test request", function (done) {
  //   request("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAqjzBuhqqX6uRPh_vFfo3u_W3XWe7VP6E&pagetoken=CqQCGwEAAGGnqNrWg5Ju4AeZy49n1cL2VKGy3VG2yL55e0h47waoV7_X48Dj64maMlyvzNpoD916_GIrTiILkd39owQlnNirokEmM-VaFKtdPQpKjwgeTY2fsqNMEimXkdb49YJq0BUwiCAls12JC5P4rG-6BFbgUiayG0yKlwPjB6p0fx9lbQdRcPJgKcUkxObffCAoI7FVnEo_Iqc8-7rR1usoM181Wc2VAteRTcSUPJ9T4pRa43NVTd-ze273H2KVpMLmCP5rWekLyQ3J8hJa6tRnKaMlnReF6A23xst8JQalcz7S9M5occG71t9eoYwVIDwu2GfkIAb8RWyvaAuFMq6lCqdqqg3H4Yr0fa4DN8E4k2w3L28V-ILDObwqWJHQ-a970hIQ7uRsPMvS9Hn0262qSLbBlxoUxwEeLJqgIsbqPMw-4xovYCmjQA4", function(error, response, body) {
  //     if (error) done(error);
  //     console.log(body);
  //     done();
  //
  //   })
  // });
});
