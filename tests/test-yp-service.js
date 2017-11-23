var assert = require('assert');

var YPService = require("../lib/services/yellowpages-service");


describe("yellowpagesService", function () {
  describe("#getBusinessDetail()", function () {
    it("should return valid JSON", function (done) {
      YPService.getBusinessDetail("15123854466").then((resp) => {
        if (! resp ) throw new Error("No valid responses");
        done();
      })
      .catch((e) => {
        done(e);
      })
    })
  })
})
