const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require("./models/comment");
const Photo = require('./models/photo');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const methodOverrride = require('method-override');
const commentRoutes = require('./routes/comments');
const photoRoutes = require('./routes/photos');
const indexRoutes = require('./routes');
const flash = require('connect-flash');




// 'mongodb+srv://username:username@myfirstcluster-izbvh.mongodb.net/test?retryWrites=true&w=majority'
//lcoal host db 'mongodb://localhost:27017/yelp_camp'
//don't have to install sesson, we have already
//flash comes before pass, cuz we need sesson configured!


app.use(flash());
app.use(express.static(__dirname + '/public'));

let DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/photo_lib';

//connect to db
mongoose.connect(DATABASE_URL, {useNewUrlParser: true,
useCreateIndex: true}).then(()=>{
    console.log('connected to Db');
}).catch (err => {console.log('message', err.message);
});

// console.log('take that', DATABASEURL);
mongoose.set('useFindAndModify', false);
app.use (bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');
//will be used on every rout what we put inside res.locals'll be awailible inside our template

app.use(methodOverrride('_method'));

// passport configuration
app.use(require('express-session')({
    secret: 'Try to change the pass if you can',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//calls f on every single route, sends to evert ejs
app.use(function (req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
//comes from User passport-local-mongoose
passport.use(new localStrategy(User.authenticate()));
//comes with pass-loc-mon user.serializeuser
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);

app.use('/photos', photoRoutes);
app.use('/photos/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";
app.listen(port,function(){
    console.log("Server has started .... at port "+ port+" ip: "+ip);
});