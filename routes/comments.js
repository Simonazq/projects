var router = require("express").Router({mergeParams: true});  //if you want to refractor the code without the common part
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware/index.js");


//ADD NEW COMMENTS
router.get("/new", middleware.isLoggedin, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground : campground});
       }
    });
});

//look up campground using id 
//create new comment
//connect new comment to campground
//redirect to show page
router.post("/", middleware.isLoggedin, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//edit comments
//delete comments

router.get("/:comment_id/edit", function(req,res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground not found...");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err || !foundComment) {
                console.log(err);
                req.flash("error", "Comment not found...");
                res.redirect("back");
            } else {
                // console.log(foundCampground);
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
    
});

//find and update the correct comment
router.put("/:comment_id", function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment)
   {
       if(err) {
           console.log(err);
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//destroy comment route
router.delete("/:comment_id", function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
           req.flash("success", "You have deleted it...");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


module.exports = router;