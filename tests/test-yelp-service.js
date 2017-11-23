var assert = require('assert');

var YelpService = require("../lib/services/yelp-service");

describe("test-yelp-service", function() {
  describe("#getYelpToken()", function() {
    it("should return a token", function(done) {
      YelpService.getYelpToken().then((token) => {
        if (! token ) done(new Error("Error getting token"));
        done();
      });
    });
  });



  describe("#getAutoShops()", function() {
    it ("should return valid JSON with no error", function(done) {
      YelpService.getAutoShops("30.2741790", "-97.7473330", "5").then((resp) => {
        if (resp) done();
        else done(new Error("no response"));
      })
      .catch((e) => {
        done(e);
      })
    });
  });
});
