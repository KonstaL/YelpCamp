var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");


router.get("/", function(req, res) {
   res.render("landing"); 
});

//================
//AUTH routes
//================

//Register routes

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to Yelpcamp " + user.username + "! :)");
                res.redirect("/campgrounds");
            });
        }
    });
});


//login routes

router.get("/login", function(req, res) {
    res.render("login", {message: req.flash("error")});
});

//login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res) {
   
});


//Log out route

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

//middleware for checking login status
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Please login");
        res.redirect("/login");
    }
}

module.exports = router;