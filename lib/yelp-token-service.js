/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-11-15
*/

var rp = require('request-promise');

var yelpkey = require("../config/.env/keys.js").YELP_ID;
var yelpsecret = require("../config/.env/keys.js").YELP_SECRET;

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
  }
}
