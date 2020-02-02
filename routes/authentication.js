var express = require('express'), 
    router = express.Router(),
    User = require('../models/user'),
    passport = require("passport");

//REGISTER
router.get("/register", function(req, res){
    res.render("register");
});
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username, email:req.body.email, admin:false}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});
//LOGIN
router.get("/login", function(req, res){
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
    res.redirect("/");
});
//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

module.exports = router;