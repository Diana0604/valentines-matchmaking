var express = require('express'), 
    router = express.Router(),
    User = require('../models/user'),
    isLoggedIn = require('../common').isLoggedIn;

router.get('/profile',isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, user){
        res.render('profile', {user:req.user});
    });
});

router.post('/profile', isLoggedIn, function(req, res){
    console.log(req.body);
    var newUser = req.user;
    if(req.body.email){
        newUser.email = req.body.email;
        console.log('email changed to: ' + newUser.email);
    }
    if(req.body.username){
        newUser = req.body.username;
        console.log('username changed to: ' + newUser.username);
    }
    console.log('new user will be: ' + newUser);
    User.findByIdAndUpdate(newUser._id, newUser, function(err, updatedUser){
        console.log('updated user:');
        console.log(updatedUser);
        res.redirect('/profile');
    });
});

module.exports = router;