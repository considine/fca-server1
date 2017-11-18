/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package fca1.0.0
* 2017-11-16
*/


module.exports = {
  /**
   * takes array of promises. returns a promise for when all requests are finished
   * @param  {[type]} asyncFuncArray
   * @return {Promise}  Promise to resolve when all requests are finished
   */
  asyncFunctionQueue : function (asyncFuncArray) {
    return new Promise(function(resolve, reject) {
      var numRequests = asyncFuncArray.length;
      var requestsCompleted = 0;

      for (var i=0; i<numRequests; i++) {
        asyncFuncArray[i].then(()=> {
          console.log(requestsCompleted);
          requestsCompleted+=1;
          if (requestsCompleted === numRequests) resolve();
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
      }
    });
  }



}
