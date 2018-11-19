var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalStrategy = require("passport-local-mongoose");
var methodOverride = require("method-override")
var Campground = require("./models/campground");
var Comment = require("./models/comments");
var User = require("./models/user");
var SeedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
SeedDB();

app.use(require("express-session")({
    secret: "I miss you everyday",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp server started..."); 
});
