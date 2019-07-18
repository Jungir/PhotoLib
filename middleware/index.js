const Photo = require('../models/photo');
const Comment = require('../models/comment');

//middleware
let middlewareObj = {};

middlewareObj.checkPhotoOwenership = function (req, res, next) {
    //is user logged in at all
    if(req.isAuthenticated()){
        //does user own photo
        Photo.findById(req.params.id, function(err, foundPhoto){
            if(err){
                req.flash('error', 'Photo not found')
                res.redirect('/photos');
            }else{
                //foundPhoto.author.id is a mongoose object 
                //req.user._id is a string 
                // can't compare them, unless you use mongoose equals function
                if(foundPhoto.author.id.equals(req.user._id)){
                    //next fun is the only thing that allows to go further
                    return next();
                }else{
                    req.flash('error', "You don't have permisson to do that");
                    res.redirect('back');}

            }
        });
    }else{
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');}
};


middlewareObj.checkCommentOwenership = function (req, res, next) {
    //is user logged in at all
    if(req.isAuthenticated()){
        //does user own photo
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect('/photos');
            }else{
                //foundPhoto.author.id is a mongoose object 
                //req.user._id is a string 
                // can't compare them, unless you use mongoose equals function
                if(foundComment.author.id.equals(req.user._id)){
                    //next fun is the only thing that allows to go further
                    return next();
                }else{
                    req.flash('error', "You don't have permisson to do that");
                    res.redirect('back');}
            }
        });
    }else{
        req.flash('error', "You need to be logged in to do that");
        res.redirect('back')}
};

middlewareObj.isLoogedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        //runs on the next page, so u do it before redirection
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;