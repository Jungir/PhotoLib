const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');
//================
// COMMENTS ROUTS 
//================
router.get('/new', middleware.isLoogedIn ,function (req,res) {
    //find camp by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err){
            console.log(err);
        }else{
            res.render('comments/new', {campground:campground});
        }
    })

})
router.post('/', middleware.isLoogedIn, function (req,res) {
    // lookup campground useing id
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
            res.redirect("/photos");
        }else{
            Comment.create(req.body.comment, function (err, comment) {
                if (err){
                    req.flash('error', 'Something went wrong');
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully created comment');
                    res.redirect('/photos/'+ campground._id);
                }
            })
        }
    })
    //create new comment
    //connect new comment to campground
    //redirect to campground show page
});


//edit comment form
router.get('/:comment_id/edit', middleware.checkCommentOwenership, function (req,res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
       if(err){
           res.redirect('back');
       }else {
           res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
       }
    });
});
// edit route
router.put('/:comment_id', middleware.checkCommentOwenership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if(err){
            res.redirect('back');
        }else {
            res.redirect('/photos/' + req.params.id);
        }
    })
    
});

//campdground destroy route
router.delete('/:comment_id', middleware.checkCommentOwenership, function (req, res){
// find by id and remove

    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', "Comment's been deleted");
            res.redirect('/photos/' + req.params.id);
        }
    })
    
});

module.exports = router;