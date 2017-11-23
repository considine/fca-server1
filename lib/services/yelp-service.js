/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-11-15
*/

var rp = require('request-promise');

var yelpkey = require("../../config/.env/keys.js").YELP_ID;
var yelpsecret = require("../../config/.env/keys.js").YELP_SECRET;


var yelpSearchApi = require("../../config/endpoints").YELP + "search";
var createQueryParameter = require("../utils/endpoints").createQueryParameter;

module.exports = {

  /**
   * using yelp secrets, returns oath2 token
   * @return {Promise<String>} token
   */
  getYelpToken : function () {
    return rp({
        method: 'POST',
        uri: 'https://api.yelp.com/oauth2/token',
        form: {
            client_id : yelpkey,
            client_secret : yelpsecret
        },
        headers: {
            /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
        }
    })
    .then((resp)=> {
      return JSON.parse(resp).access_token;
    });
  },

  /**
   * Gets all auto_repair businesses
   * @param  {string} lat        latitude of location
   * @param  {string} lon        longitude of location
   * @param  {number} numResults number of results to be returned (max 50)
   * @return {Promise}
   */
  getAutoShops : function (lat, lon, numResults) {
    var options = this.prepareYelpGetRequest(yelpSearchApi +  createQueryParameter("categories", "autorepair", true) + createQueryParameter("limit", numResults) +  createQueryParameter("radius", 10000) + createQueryParameter("longitude", lon) + createQueryParameter("latitude", lat));
    return this.getYelpToken().then((token) => {
      options["headers"]["Authorization"] = "Bearer " + token;

      return options;
    })
    .then(rp) // TODO move below this to driver
    .then((resp) => JSON.parse(resp))
    .then((jsonResp) => {

      var fcaResp = [];
      for (var i=0; i<jsonResp.businesses.length; i++) {
        var business = jsonResp.businesses[i];
        var row = {
          "title" : business.name,
          "image" : business.image_url,
          "address" : business.location.address1 + ", " + jsonResp.businesses[i].location.city,
          "phone" : business.display_phone,
          "id" : business.id,
          "key_phone" : business.phone,
          "overall_rating" : business.rating,
          "detail" : "http://192.168.1.64:9000/api/v1/business/" + createQueryParameter("phone", business.phone, true) + createQueryParameter("yelp_id", business.id)
        };
        fcaResp.push(row);
      }
      return fcaResp;
    });
  },


  /**
   * Takes a Yelp API  endpoint, attaches
   * @param  {string} uri The url to place in the headers
   * @return {object}   argument for request / request-promise interface to accept with correct authorization headers
   */
  prepareYelpGetRequest : function (uri)   {
    var options = {
      url: uri,
      headers: {

      }
    };
    return options;
  }


}
