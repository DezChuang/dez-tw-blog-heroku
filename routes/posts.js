var express     = require("express"),
    router      = express.Router(),
    Post        = require("../models/post"),
    middleware  = require("../middleware");

//INDEX - Show all posts from DB
router.get("/", function(req,res){
    //Get all posts from DB
    Post.find({}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts: allPosts, page: 'posts'});
        }
    });
});

//CREATE - Add new posts to DB
router.post("/", middleware.isAdmin, function(req,res){
    //get data from form and add to post array in app.js
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {title: title, image: image, description: description, author: author};
    //Create a new post and save to DB
    Post.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

//NEW - Show form to create new posts
router.get("/new", middleware.isAdmin, function(req,res){
    res.render("posts/new");
});

//SHOW - Show more information about posts
router.get("/:id", function(req, res){
    //find the post with provided ID
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err) {
            console.log(err);
        } else {
            //render show template with that post
            res.render("posts/show", {post: foundPost});
        }
    });

});

//EDIT
router.get("/:id/edit", middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("posts/edit", {post: foundPost});
    });
});

//UPDATE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
    //Add express-sanitizer to prevent middleware script in post
    //req.body.post.description = req.sanitize(req.body.post.description);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
        if(err){
            console.log(err);
            res.redirect("/posts");
        } else{
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/posts");
        } else {
            req.flash("success", "Successfully deleted post");
            res.redirect("/posts");
        }
    });
});

module.exports = router;
