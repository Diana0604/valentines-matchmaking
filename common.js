
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function isAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.admin){
            return next();
        }
        res.redirect("/");
        return;
    }
    res.redirect("/login");
};

module.exports = {isLoggedIn:isLoggedIn, isAdmin:isAdmin};