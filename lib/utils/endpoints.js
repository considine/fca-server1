/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-11-17
*/

/**
 * utilities for end points
 * @type {Object}
 */
module.exports = {
  /**
   * [createQueryParameter description]
   * @param  {[type]} qKey   query parameter
   * @param  {[type]} qVal   query value
   * @param  {[type]} firstQ Is this the first query parameter?
   * @return {string}   the query parameter string
   */
  createQueryParameter : function(qKey, qVal, firstQ) {
    var qparam = (firstQ) ? "?" : "&";
    qparam += (qKey + "=" + qVal);
    return qparam;
  }
}
