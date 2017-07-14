var express         = require("express"),
    router          = express.Router(),
    Campground      = require("../models/campground"),
    middleware      = require("../middleware");

//INDEX campground route
router.get("/", function(req, res) {
  
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user});
        }
    });
});

//Create campground route
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.newCamp;
    var img = req.body.newImg;
    var desc = req.body.newDesc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, img: img, desc: desc, author: author};
    
    Campground.create(newCampground, function(err, newcamp) {
        if (err) {
            console.log(err);
        } else {
            console.log("New campground added");
            console.log(newcamp);
            req.flash("success", "Campground created!");
            res.redirect("/campgrounds");
        }
    });
});

//new Campground route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//show campground route
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if (err) {
            req.flash("error", "Campground not found");
            console.log(err);
        } else {
             res.render("campgrounds/show", {foundCamp: foundCamp});
        }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
             res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE campgound route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res) {
    var name = req.body.newCamp;
    var img = req.body.newImg;
    var desc = req.body.newDesc;
    var price= req.body.newPrice;
    var updatedCampground = {name: name, img: img, desc: desc, price: price};
    Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updatedCampgroundFinal) {
       
        if(err) {
             console.log(err);
            req.flash("error", "You don't have permission to do that");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully updated campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });    
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;