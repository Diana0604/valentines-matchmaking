var express = require('express'), 
    router = express.Router(),
    User = require('../models/user'),
    isLoggedIn = require('../common').isLoggedIn;

router.get('/profile',isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, user){
        console.log('showing profile of user: ' + user);
        res.render('profile', {user:req.user});
    });
});

module.exports = router;