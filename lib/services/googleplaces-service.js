var rp = require("request-promise");
var request = require("request");
var GoogleApi = require("../../config/endpoints").GOOGLE;
var GoogleDetailApi = require("../../config/endpoints").GOOGLE_DETAIL;

var createQueryParameter = require("../utils/endpoints").createQueryParameter;



function GooglePlacesService (apiKey) {
  var self  = this;
  /**
   * [description]
   * @param  {[type]} latln    [description]
   * @param  {[type]} category [description]
   * @return {[type]}          [description]
   */
  this.getPlacesByLocation = function (latln, category) {
    var uri = generateSearchUrl(latln, category);
    return rp(uri).then((resp) => JSON.parse(resp));
  }
  /**
   * [placeIdSearchUtility description]
   * @param  {[type]}   reqUrl [description]
   * @param  {[type]}   places [description]
   * @param  {Function} cb     [description]
   * @param  {[type]}   ecb    [description]
   * @return {[type]}          [description]
   */
  function placeIdSearchUtility (reqUrl, places, cb, ecb) {
      request(reqUrl, function(error, response, body) {
          try {
            var json = JSON.parse(body);
          } catch(e) {
            e.message += (" " + body);
            ecb(e);
            return;
          }

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

  /**
   * [description]
   * @param  {[type]} zipcode  [description]
   * @param  {[type]} category [description]
   * @return {[type]}          [description]
   */
  this.getPlaceIdsByLoc= function (latln, category) {
    return new Promise((resolve, reject) => {
      console.log(latln);
        placeIdSearchUtility((generateSearchUrl(latln, category)), [], function(places) {
          resolve(places);
        }, function(error) { reject(error); });
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
