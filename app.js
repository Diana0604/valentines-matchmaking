    //general
var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    //db
    mongoose = require('mongoose'),
    Question = require("./models/questions").Question,
    Answer = require("./models/answer").Answer,
    User = require("./models/user"),
    seedDB = require("./seedDB"),
    //passport
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

app.use(require("express-session")({
    secret: "Si sabes esperar, durant molts anys",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/valentine", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//constants
var VALIDTYPE = new Set();
VALIDTYPE.add("text");

var answersListAux = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//============================================== GENERAL =================================================
app.get("/", function(req, res){
    res.render("index");
});

//========================================= MANAGE QUESTIONS =============================================
//INDEX:
app.get("/questions", isLoggedIn, function(req, res){
    Question.find({}, function(err, questions){
        if(err){
            console.log('could not load questions!');
        } else{
            res.render("questions", {questions:questions});
        }
    });
});
//NEW:
app.get("/questions/new", isLoggedIn, function(req, res){
    res.render("newquestion");
});
//CREATE:
app.post("/questions", isLoggedIn, function(req, res){
    console.log("type received");
    console.log(req.body.question);
    Question.create(req.body.question, function(err, question){
        if(err){
            console.log("error: " + err);
        } else{
            console.log("new question ");
            console.log(question);
        }
    });
    res.redirect("/questions");
});
//SHOW
app.get("/questions/:id", isLoggedIn, function(req, res){
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log("error: ");
            console.log(err);
            res.send('something went wrong');
        } else{
            console.log(question);
            res.render("showquestion", {question: question});
        }
    })
});
//EDIT
app.get("/questions/:id/edit", isLoggedIn, function(req, res){
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.send("something went wrong");
        } else{
            res.render("editquestion", {question:question});
        }
    });
})
//UPDATE
app.put("/questions/:id", isLoggedIn, function(req, res){
    console.log("PUT RECEIVED");
    console.log(req.body.question);
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, question){
        if(err){
            console.log(err);
        } else{
            console.log("question updated: " + question);
        }
    });
    res.redirect("/questions/" + req.params.id);
});
//DESTROY
app.delete("/questions/:id", isLoggedIn, function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error: " + err);
            res.send("something went wrong");
        } else{
            res.redirect("/questions");
        }
    });
});
//============================================ ANSWER TEST ===============================================
app.get("/test", isLoggedIn, function(req, res){
    Question.find({}, function(err, questions){
        if(err){
            console.log("error");
            res.send("error");
        } else{
            console.log(questions);
            res.render("test", {questions: questions});
        }
    });
});
//this spagheti code MUST be reviewed
app.post("/test", function(req, res){
    var newUser = req.user;
    newUser.answerList = [];
    console.log('preparing new user');
    req.body.answers.forEach(function(answer, index){
        Question.findById(req.body.questionID[index], function(err, question){
            if(err){
                console.log('error: ' + err);
            } else{
                answer.question = question;
                Answer.create(answer, function(err, answerdb){
                    if(err){
                        console.log('error: ' + err);
                    } else{
                        newUser.answerList.push(answerdb);
                        if(newUser.answerList.length === req.body.answers.length){
                            User.findByIdAndUpdate(newUser._id, newUser, function(err, user){
                                if(err){
                                    console.log('error: ' + err);
                                } else{
                                    console.log('user updated' + user);
                                }
                            });
                        }
                    }
                });
            }        
        });
    });
    res.redirect("/test/finish");
});
app.get("/test/finish", isLoggedIn, function(req, res){
    res.render("finish");
});
//============================================ AUTH ROUTES ===============================================
//REGISTER
app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
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
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
    res.redirect("/");
});
//LOGOUT
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

//GENERIC:
app.get("*", function(req, res){
    res.send('this page does not exists');
});
//PORT:
app.listen(3000, function(){
    //seedDB();
    console.log('server started');
});