//This is now our Express App

const express = require("express");
const exphbs = require("express-handlebars"); // [handlebars - optional]
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("./config/passport");
const app = express();

// [Handlebars]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Express Session
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Method Override
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//Cookie Parser: Use it before Body Parser
app.use(cookieParser());

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Morgan
app.use(morgan("combined"));

//Passport (after express session, but before routes)
app.use(passport.initialize()); //use Passport as middleware
app.use(passport.session()); //when we want passport to keep track of our logged in user

//Routes
app.use(require("./routes"));

//Error Handler Middleware
app.use(require("./middleware/error_handler_middleware"));

//Remember to export app
module.exports = app;
