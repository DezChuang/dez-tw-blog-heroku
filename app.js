var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    User            = require("./models/user"),
    SeedDB          = require("./seeds");

// requiring routes
var commentRoutes   = require("./routes/comments"),
    postRoutes      = require("./routes/posts"),
    indexRoutes     = require("./routes/index");

//mongoose.connect("mongodb://localhost/dez_blog");
mongoose.connect("mongodb://dezchuang:qqqqq12345@ds147777.mlab.com:47777/deztwblog");
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//SeedDB();

app.locals.moment = require('moment');
// passport configuration
app.use(require("express-session")({
    secret: "Yesterday I saw a lion kiss a deer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// routes setting
app.use("/", indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(app.get('port'), function(){
    console.log('Node app is running on ', "http://localhost:" + app.get('port') + "/");
});
