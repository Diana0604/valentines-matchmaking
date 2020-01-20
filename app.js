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
app.get("/", isLoggedIn, function(req, res){
    res.render("index");
});

//========================================= MANAGE QUESTIONS =============================================
//INDEX:
app.get("/questions", function(req, res){
    Question.find({}, function(err, questions){
        if(err){
            console.log('could not load questions!');
        } else{
            res.render("questions", {questions:questions});
        }
    });
});
//NEW:
app.get("/questions/new", function(req, res){
    res.render("newquestion");
});
//CREATE:
app.post("/questions", function(req, res){
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
app.get("/questions/:id", function(req, res){
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
app.get("/questions/:id/edit", function(req, res){
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
app.put("/questions/:id", function(req, res){
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
app.delete("/questions/:id", function(req, res){
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
app.get("/test", function(req, res){
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
app.post("/test", function(req, res){
    console.log("POST FOR TEST");
    console.log(req.body.answers);
    var answerList = [];
    req.body.answers.forEach(function(answer, index){
        Question.findById(req.body.questionID[index], function(err, question){
            console.log("question: ");
            console.log(question);
            answer.question = question;
            answerList.push(answer);
        });
    });
    console.log('answerList: ' + answerList);
    User.create({
        name: "fake", 
        email: "fake@gmail.com",
        answerList: answerList
    }, function(err, user){
        if(err){
            console.log("error: " + err);
        } else{
            console.log(user);
        }
    });
    /*
        console.log(answer.question._id);
        Question.findById(answer.question._id, function(err, question){
            if(err){
                console.log('error' + err);
            } else{
                console.log('answer for question: ' + question);
                nextAnswer = new Answer({
                    question: question,
                    text: answer.text,
                    choice: answer.choice
                });
                console.log("new answer created: ");
                console.log(nextAnswer);
                answerList.push(nextAnswer);
            }
        });
    });
    //console.log(answerList[0].question);
    */
    /*
    var answerList = [];
    req.body.answers.forEach(function(answer){
        answerList.push(new Answer(answer));
    });
    console.log('answerList: ' + answerList);
    User.create({
        name: "fake", 
        email: "fake@gmail.com",
        answerList: answerList
    }, function(err, user){
        if(err){
            console.log("error: " + err);
        } else{
            console.log(user);
        }
    });
    */
    res.redirect("/test/finish");
});
app.get("/test/finish", function(req, res){
    res.render("finish");
});
/*
//ANSWER QUESTIONS:
app.get("/test/finish", function(req, res){
    AnswersList.create({
        answers: answersListAux
    }, function(err, answer){
        if(err){
            console.log("ERROR: " + err);
        } else{
            console.log("new answer added: " + answer);
        }
    });
    res.render("finish");
});
app.get("/test/:question", function(req, res){
    if(isNaN(req.params.question)){
        res.send("this page is not valid");
    } else{
        var questionNumber = Number(req.params.question) - 1;
        //Get questions from db
        Question.find({}, function(err, questions){
            if(err){
                console.log("ERROR! " + err);
            } else{
                if(questionNumber < questions.length){
                    res.render("test", {question:questions[questionNumber]});
                } else{
                    res.redirect("/test/finish");
                }
            }
        });
    }
});
app.post("/:answer", function(req, res){
    var newAnswer = new Answer ({
        number: req.params.answer,
        answer: req.body.answer
    });
    answersListAux.push(newAnswer);
    var nextQ = Number(req.params.answer) + 1;
    res.redirect("test/" + nextQ);
});
//GENERIC:
app.get("*", function(req, res){
    res.send('this page does not exists');
});
*/

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

//PORT:
app.listen(3000, function(){
    //seedDB();
    console.log('server started');
});