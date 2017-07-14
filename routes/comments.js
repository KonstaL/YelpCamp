var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    middleware      = require("../middleware");


//Comments Create route
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                   console.log(err);
                } else {
                    comment.author.username = req.user.username
                    comment.author.id = req.user._id;
                    
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment saved!");
                    res.redirect("/campgrounds/" + campground._id);
                }
           });
       }
    });
});

//Comments New Route
router.get("/new", middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground}); 
        }
    });
});



//Comments EDIT route
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err) {
          res.redirect("back");
       } else {
           res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
       }
        
    });
  
});

//comments UPDATE route 
router.put("/:comment_id", middleware.checkCommentOwner, function (req, res) {
    console.log(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            req.flash("error", "We couldn't find that comment");
            res.redirect;
        } else {
            req.flash("success", "Comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//comment DESTROY route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           req.flash("error", "Comment not found");
           res.redirect("back");
       } else {
           req.flash("success", "Comment successfully deleted!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});



module.exports = router;

