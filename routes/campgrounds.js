var router = require("express").Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res) {
    //Get all campgrounds from DB
    //console.log(req.body.user);
    Campground.find({}, function (err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {camp : allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedin, function(req, res) {
    var name = req.body.name;
    var img = req.body.img;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, img: img, price: price, description : description, author: author};
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err){
            
            console.log(err);
        } else {
            res.redirect("/campgrounds");    
        }
    });
});

router.get("/new", middleware.isLoggedin, function(req, res) {
    res.render("campgrounds/new");
});

//show a particular camp page
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            res.flash("error", "Campground not found...");
            res.redirect("back");
        } else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

router.get("/:id/edit", middleware.checkCampGroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            res.render("campgrounds/edit", {campground : foundCampground});
        }
    });
});

//find and update the correct campground
router.put("/:id", middleware.checkCampGroundOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground)
   {
       if(err) {
           console.log(err);
           res.redirect("/campground");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});


//destroy campground route
router.delete("/:id", middleware.checkCampGroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       }
       req.flash("success", "You have deleted it...");
       res.redirect("/campgrounds"); 
    });
});

module.exports = router;