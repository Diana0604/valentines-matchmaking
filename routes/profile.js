var matchings = new Map();
matchings.set("Diana", "SarahShear");
matchings.set("SarahShear", "Diana");
matchings.set("Henry", "GeorgieKirk");
matchings.set("GeorgieKirk", "Henry");
matchings.set("FunnyGirl", "Three kids stacked up on each other in a trenchcoat");
matchings.set("Three kids stacked up on each other in a trenchcoat", "FunnyGirl");
matchings.set("Neta CT", "@amymawer");
matchings.set("@amymawer", "Neta CT");
matchings.set("OmarZat", "Nathalie");
matchings.set("Nathalie", "OmarZat");
matchings.set("TaviaFox", "BW");
matchings.set("BW", "TaviaFox");
matchings.set("Eva", "Mengqiu");
matchings.set("Mengqiu", "Eva");
matchings.set("Zhaolin", "amaliapasxal@outlook.com");
matchings.set("amaliapasxal@outlook.com", "Zhaolin");
matchings.set("Lululizard", "Juliet");
matchings.set("Juliet", "Lululizard");
matchings.set("Danny Romeo", "Paul H. Barnes");
matchings.set("Paul H. Barnes", "Danny Romeo");
matchings.set("loverboy2000", ["Clo", "Elysia"]);
matchings.set("Clo", ["Elysia", "loverboy2000"]);
matchings.set("Elysia", ["loverboy2000", "Clo"]);
matchings.set("club_kant_even_handle_me", "Avgi");
matchings.set("Avgi", "club_kant_even_handle_me");
matchings.set("Maddie", "inespecas");
matchings.set("inespecas", "Maddie");
matchings.set("Natasha", "Yuan");
matchings.set("Yuan", "Natasha");
matchings.set("mandajoensson", "Qiyue Luo");
matchings.set("Qiyue Luo", "mandajoensson");

var express = require('express'), 
    router = express.Router(),
    User = require('../models/user'),
    isLoggedIn = require('../common').isLoggedIn;

router.get('/profile',isLoggedIn, function(req,res) {
    User.findById(req.user._id, function(err, user){
        var match_es = matchings.get(user.username);
        if(typeof match_es === "string"){
            User.findOne({'username':match_es}, function(err, match){
                res.render('profile', {user:req.user, match:match.username, email:match.email});
            });
        } else{
            User.findOne({'username':match_es[0]}, function(err, match1){
                User.findOne({'username':match_es[1]}, function(err, match2){
                    res.render('profile', {user:req.user, match:[match1.username, match2.username]});
                });
            });
        } 
    });
        //res.render('profile', {user:req.user, match:matchings.get(user.username)});
    //});
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