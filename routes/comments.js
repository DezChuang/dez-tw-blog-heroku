var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Post        = require("../models/post"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//COMMENT NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find post by id
    Post.findById(req.params.id, function(err, post){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/new", {post: post});
        }
    });
});

//COMMENT CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup post by id
    Post.findById(req.params.id, function(err, post){
        if (err){
            res.redirect("back");
        } else {
            //create new comment
            req.body.comment.text = req.sanitize(req.body.comment.text);
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                } else {
                    //add username and if to a comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //connect new comment to post
                    post.comments.push(comment);
                    post.save();
                    //redirect to post show page
                    req.flash("success", "Successfully added comment");
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //Add express-sanitizer to prevent middleware script in comment
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/posts/" + req.params.id);
        }
    });
});

module.exports = router;
