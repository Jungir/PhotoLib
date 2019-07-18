const express = require('express');
const router = express.Router();
const Photo = require('../models/photo');
// only works with index
const middleware = require('../middleware');


//============================
//INDEX - show all photos
//============================

router.get("/", function(req, res){
    // Get all photos from DB
    // passport contains the info about  our user, id+username req.user;
    Photo.find({}, function(err, allPhotos){
       if(err){
           console.log(err);
       } else {
          res.render("photos/index",{photos: allPhotos, currentUser: req.user});
       }
    });
});

//CREATE - add new photo to DB
router.post("/", middleware.isLoogedIn, function(req, res){
   
    // get data from form and add to photos array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newPhoto = {name: name, image: image, description: desc, author: author, price:price}
    //req.user contains the info about the currently logged in user
    // console.log(req.user);
    
    
    // Create a new photos and save to DB
    Photo.create(newPhoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Photo page
            // console.log(newlyCreated);
            res.redirect("/photos");
        }
    });
});

//NEW - show form to create new photo
router.get("/new", middleware.isLoogedIn, function(req, res){
   res.render("photos/new"); 
});

// SHOW - shows more info about one photo
router.get("/:id", function(req, res){
    //find the photo with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            // console.log(foundPhoto)
            //render show template with that photo
            res.render("photos/show", {photo: foundPhoto});
        }
    });
});

// edit photo route it is form
router.get('/:id/edit', middleware.checkPhotoOwenership, function (req, res) {
    //middleware is checking for authentication
    Photo.findById(req.params.id, function(err, foundPhoto){
        res.render('photos/edit', {photo: foundPhoto});  
    });
});

//update photo route sending form to
router.put('/:id', middleware.checkPhotoOwenership,function (req,res) {
    // let data = {
    //     name: req.body.name,
    //     image: req.body.image,
    //     description: req.body.description
    // } but we have the easy way name="photo(obj.groupping)[name]"
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function (err, updatedPhoto) {
        if(err){
            res.redirect("/photo");
        }else {
            res.redirect('/photos/'+req.params.id);
        }
    })
    
})

//remove route
router.delete('/:id', middleware.checkPhotoOwenership ,function (req,res) {
    Photo.findByIdAndRemove(req.params.id, function (err, success) {
        if(err){
            res.redirect('/photos');
        }else {
            res.redirect('/photos');
        }
    })
    
})



module.exports = router;