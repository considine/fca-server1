var express = require('express');
var router = express.Router();
var cors = require('cors')

// Libs
var PlacesNearbye = require("../lib/places-nearbye");
var GooglePlaces = require("../lib/services/googleplaces-service");
var GoogleApiKey = require("../config/.env/keys").GOOGLE_PLACES_API_KEY;
var GoogleMaps = require("../config/.env/keys").GOOGLE_MAPS_API_KEY;

router.get("/auto-repair/:latitude/:longitude/:limit", cors(), function(req, res) {
  PlacesNearbye.getAutoShops(req.params.latitude, req.params.longitude, req.params.limit).then((resp)=>{
    res.send({"success" : true, results : resp});
  })
  .catch((e) => {
    res.status(500).send({"error" : true, "message" : e});
  });
});


router.get("/business", cors(), function(req, res) {


  PlacesNearbye.getBusinessDetail(req.query.phone, req.query.yelp_id).then((resp) => {
    res.send({"success" : true, results : resp});
  })
  .catch((e) => {
    res.status(500).send({"error" : true, "message" : e});
  });
});



router.get("/google-places/:zip", function(req, res) {
  var gs = new GooglePlaces(GoogleApiKey, GoogleMaps);
  gs.getPlaceIdsByZip(req.params.zip, "car_repair")
    .then((results) => {
      return res.send({"results" : results, "count" : results.length});
    })
    .catch((e) => res.status(400).send({"error" : true, "message" : e.message}));

});




module.exports = router;
