var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comments");


middlewareObj.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Log in first...");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //check if the user logged in 
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found...");
                res.redirect("back");
            } else {
                //check if the user is the author
                //can not use === cause author.id is an object and _id is string
                if(foundComment.author.id.equals(req.user._id)) {  
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that...");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


middlewareObj.checkCampGroundOwnership = function(req, res, next) {
    //check if the user logged in 
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){   //there is an error in the campground
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //check if the user is the author
                if(foundCampground.author.id.equals(req.user._id)) {  //can not use === cause author.id is an object and _id is string
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that...");
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;