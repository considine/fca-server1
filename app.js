var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var apiRoutes = require("./routes/api.js");
var viewRoutes = require("./routes/views.js");



var app = express();
var timeout = require('connect-timeout'); //express v4

app.use(timeout(120000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}
// var mongoose = require("mongoose");
// mongoose.Promise = global.Promise; /*See:  https://github.com/Automattic/mongoose/issues/4291 */
// const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
// mongoose.Promise = global.Promise;
// mongoose.connect ('mongodb://localhost/toptal-joggers', { useMongoClient: true });
// db = mongoose.connection;
// db.on('error', function() {
//   throw Error("Could not connect to mongoose")
// } );




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/api/v1/", apiRoutes);


app.listen(9000, "0.0.0.0")


module.exports = app;
