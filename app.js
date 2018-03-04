var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("./mongo");
var index = require("./routes/index");

var app = express();

const allowDomains = [
  "https://client-nichango.herokuapp.com",
  "http://www.2ch-ngo.club"
];

function checkAllowDomains(protocol, host) {
  const address = protocol + "://" + host;
  return allowDomains.indexOf(address) !== -1;
}

const allowDomain =
  process.env.NODE_ENV == "local"
    ? "http://localhost:3000"
    : "https://client-nichango.herokuapp.com";

mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger("dev"));

app.use((req, res, next) => {
  console.log("Request", req.protocol, req.host, req.hostname);

  if (process.env.NODE_ENV == "local") {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  } else {
    checkAllowDomains(req.protocol, req.host) &&
      res.header(
        "Access-Control-Allow-Origin",
        req.protocol + "://" + req.host
      );
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", true);

  if ("OPTIONS" === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
