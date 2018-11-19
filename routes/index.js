var router = require("express").Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var passport = require("passport")
var middleware = require("../middleware");

router.get("/", function(req, res) {
    res.render("landing");
});

//Auth Routes
//show sign up form
router.get('/register', function(req, res) {
    res.render("register");
});

//handel sign up logic
router.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, open a new world, " + user.username);
            res.redirect("/campgrounds");
        }); 
    });
});

//handle log in form 
router.get("/login", function(req, res) {
    
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have logged out...");
    res.redirect("/campgrounds");
});

module.exports = router;