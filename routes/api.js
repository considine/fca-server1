var express = require('express');
var router = express.Router();
var cors = require('cors')

// Libs
var PlacesNearbye = require("../lib/places-nearbye");

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




module.exports = router;
