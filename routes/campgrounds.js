var express         = require("express"),
    router          = express.Router(),
    Campground      = require("../models/campground"),
    middleware      = require("../middleware"),
    geocoder         = require("geocoder");

//INDEX campground route
router.get("/", function(req, res) {
    if(typeof(req.query.search) !== "undefined") {
        var regex = new RegExp(escapeRegExp(req.query.search), "gi");
        Campground.find({name: regex}, function(err, campgrounds) {
            if (err) {
                console.log(err);
            } else {
                if(campgrounds.length === 0) {
                    var searchMessage = "Antamallasi hakusanalla ei löytynyt tuloksia";
                }
                else {
                    var searchMessage = 'Leirintäpaikat haulla "' + req.query.search + '"';
                }
                res.render("partials/listCampgrounds",
                    {
                        campgrounds: campgrounds,
                        searchMessage : searchMessage
                    });
            }
        });
 }  else if(req.xhr) {
        var perPage = 4,
            page    = Math.max(0, req.query.page)
        Campground.find({}).limit(perPage).skip(perPage * page).exec(function(err, campgrounds) {
        //Get all campgrounds from DB
        /*Campground.find({}).skip(4).exec(function(err, campgrounds) {*/
            if (err) {
                console.log(err);
            } else if(campgrounds.length < 4) {
                res.render("partials/listCampgrounds", { campgrounds: campgrounds});
            } else {
                res.render("partials/listCampgrounds", { campgrounds: campgrounds});
            }
        });
    } else {
        //Get 4 campgrounds from the DB

        /*Disabling for temporary deployment*/
        /*Campground.find({}).limit(4).exec(function(err, campgrounds) {*/
        Campground.find({}, function(err, campgrounds) {
            if (err) {
                console.log(err);
            } else {
                 res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user});
            }
        });
    }
});

//Create campground route
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.newCamp;
    var img = req.body.newImg;
    var desc = req.body.newDesc;
    var price = req.body.newPrice;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.newLocation, function(err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, img: img, desc: desc, price: price,
                            author: author, location: location, lat: lat, lng: lng};
        //Create the actual campground and save it
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
    geocoder.geocode(req.body.newLocation, function(err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var updatedCampground = {name: name, img: img, desc: desc, price: price,
                                location: location, lat: lat, lng: lng};
        //Find the specific campground and update
        Campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updatedCampgroundFinal) {
            if (err) {
                console.log(err);
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            } else {
                req.flash("success", "Successfully updated campground!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
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

//For preventing workload on the server
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}




module.exports = router;