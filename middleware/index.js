var Post  = require("../models/post"),
    Comment     = require("../models/comment");

// All the middleware goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if(err) {
                req.flash("error", "Post not found.");
                res.redirect("back");
            } else {
                //does this user own the post?
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You have no permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                //does this user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You have no permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

//middleware to check secret page access authentication
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
};

//middleware to check admin role allowed to post
middlewareObj.isAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.username === 'dez'){
            next();
        } else {
            req.flash("error", "You only can comment on posts, thanks!");
            res.redirect("/posts");
        }
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
