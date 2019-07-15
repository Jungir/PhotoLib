const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
// only works with index
const middleware = require('../middleware');


//============================
//INDEX - show all campgrounds
//============================

router.get("/", function(req, res){
    // Get all campgrounds from DB
    // passport contains the info about  our user, id+username req.user;
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoogedIn, function(req, res){
   
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, author: author, price:price}
    //req.user contains the info about the currently logged in user
    // console.log(req.user);
    
    
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoogedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// edit campground route it is form
router.get('/:id/edit', middleware.checkCampgroundOwenership, function (req, res) {
    //middleware is checking for authentication
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});  
    });
});

//update campground route sending form to
router.put('/:id', middleware.checkCampgroundOwenership,function (req,res) {
    // let data = {
    //     name: req.body.name,
    //     image: req.body.image,
    //     description: req.body.description
    // } but we have the easy way name="campground(obj.groupping)[name]"
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if(err){
            res.redirect("/campground");
        }else {
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
    
})

//remove route
router.delete('/:id', middleware.checkCampgroundOwenership ,function (req,res) {
    Campground.findByIdAndRemove(req.params.id, function (err, success) {
        if(err){
            res.redirect('/campgrounds');
        }else {
            res.redirect('/campgrounds');
        }
    })
    
})



module.exports = router;