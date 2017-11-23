var rp = require('request-promise');
var request = require("request");
var YellowPagesApi = require("../../config/endpoints").YELLOW_PAGES;
var yellowPagesKey = require("../../config/.env/keys.js").YELLOW_PAGES_API_KEY;


var createQueryParameter = require("../utils/endpoints").createQueryParameter;


/**
 * All methods interacting with YP API
 * @type {Object}
 */
module.exports = {

  /**
   * Adds user-agen header to request. Otherwise YP rejects
   * @param  {string} uri
   * @return {object} first parameter of rp
   */
  prepareYellowPagesGetRequest : function (uri) {
    return {
      url: uri,
      headers : {
        'User-Agent' : 'request'
      }
    }
  },

  /**
   * [description]
   * @return {[type]} [description]
   */
  getBusinessDetail : function (phonenumber) {
    var yellowSearchEndpoint = YellowPagesApi + createQueryParameter("format", "json", true) + createQueryParameter("key", yellowPagesKey) + createQueryParameter("term", phonenumber) + createQueryParameter("phonesearch", "true");
    return rp(this.prepareYellowPagesGetRequest(yellowSearchEndpoint)).then((resp) => JSON.parse(resp));
  }


}
