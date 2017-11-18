/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package FCA 1.0.0
* 2017-11-13
*/
var rp = require('request-promise');
var request = require("request");

var YelpTokenService = require("./yelp-token-service");
// Endpoints and keys
var endpoints = require("../config/endpoints");
var yelpSearchApi = endpoints.YELP + "search";
var YellowPagesApi = endpoints.YELLOW_PAGES;
var keys = require("../config/.env/keys.js");
var yellowPagesKey = keys.YELLOW_PAGES_API_KEY;

// Utilities
var AsyncUtils = require("./concurrent-requests");

var accessToken;


//TODO extract separate "Yelp" and "Yellow Pages Service". Use this class as a driver


module.exports = {
  getAutoShops : function (lat, lon, numResults){
      return prepareYelpGetRequest(yelpSearchApi +  createQueryParameter("categories", "autorepair", true) + createQueryParameter("limit", numResults) +  createQueryParameter("radius", 10000) + createQueryParameter("longitude", lon) + createQueryParameter("latitude", lat))
      .then(rp)
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
   * retrieves: accreditation, hours, open now
   * @param  {string} phoneNumber [description]
   * @return {object}
   */
  getBusinessDetail : function (phoneNumber, yelpId) {
    return this.joinYelpAndYellowPages(phoneNumber, yelpId)
    .then((dataBlob) => {
      console.log(JSON.stringify(dataBlob));
      var businessDetail  = {};
      var yp = dataBlob["yellow_pages"];
      if (yp) { // if the search was successful
        // Yellow pages data
        try {
          var searchResult = yp["searchResult"]["searchListings"]["searchListing"][0];
          businessDetail["website"] = searchResult["websiteURL"];
          businessDetail["activeHours"] = searchResult["openHours"];
          businessDetail["paymentMethods"] = searchResult["paymentMethods"];
          businessDetail["email"] = searchResult["email"];
        } catch(e) {
          
        }
      }


      // Yelp Data
      businessDetail["comments"] = dataBlob["yelp"]["reviews"];
      return businessDetail;
    });
  },

  joinYelpAndYellowPages : function(phoneNumber, yelpId) {
    var yellowSearchEndpoint = YellowPagesApi + createQueryParameter("format", "json", true) + createQueryParameter("key", yellowPagesKey) + createQueryParameter("term", phoneNumber) + createQueryParameter("phonesearch", "true") ;
    var yelpBusinessEndpoint = endpoints.YELP  + yelpId + "/reviews";

    var joinedData = {};

    return AsyncUtils.asyncFunctionQueue([

      prepareYelpGetRequest(yelpBusinessEndpoint).then(rp).then((resp) => {
        joinedData["yelp"] = JSON.parse(resp);
      }),

      rp(prepareYellowPagesGetRequest(yellowSearchEndpoint)).then((resp) => {
        joinedData["yellow_pages"] = JSON.parse(resp);
      })
    ])
    .then(() => {
      return joinedData;
    });
  }
}


// TODO: add these to corresponding services

function prepareYelpGetRequest (uri)   {
  var options = {
    url: uri,
    headers: {

    }
  };
  return YelpTokenService.getYelpToken().then((token) => {
    options["headers"]["Authorization"] = "Bearer " + token;
    return options;
  });
}


function prepareYellowPagesGetRequest (uri) {
  return {
    url: uri,
    headers : {
      'User-Agent' : 'request'
    }
  }
}



//TODO utils, test
/**
 * [createQueryParameter description]
 * @param  {[type]} qKey   query parameter
 * @param  {[type]} qVal   query value
 * @param  {[type]} firstQ Is this the first query parameter?
 * @return {string}   the query parameter string
 */
function createQueryParameter (qKey, qVal, firstQ) {
  var qparam = (firstQ) ? "?" : "&";
  qparam += (qKey + "=" + qVal);
  return qparam;
}
