const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//==========
//ROOT ROUTE
//==========
router.get("/", function(req, res){
    res.render("landing");
});

//================
// AUTH ROUTES
//================

//show register form
router.get('/register', function (req, res) {
    res.render('register');
});


// handle register logic
router.post('/register', function(req,res){
    //provided with local-mang-pass
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            //err will be send thoruh err object
            req.flash('error', err.message);
            //don't use res.render, with flash use res.redirect
            return res.redirect('/register');
        }
        passport.authenticate('local')(req,res,function () {
            req.flash('success', 'Welcome to Photo Lib' + " " + user.username);
            res.redirect('/photos');
        });
    });
});

//show login form
router.get('/login', function (req, res) {
    res.render('login');
});
//login logic 
router.post('/login', passport.authenticate('local', {successRedirect: '/photos', failureRedirect: '/login'}),function (req, res) {
});

//logout 
router.get('/logout', function (req,res) {
    req.logout();
    req.flash('success', 'Logged You Out');
    res.redirect('/photos');
})


module.exports = router;