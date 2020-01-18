var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    questiondb = require("./models/questions"),
    Question = questiondb.Question,
    QuestionText = questiondb.QuestionText,
    QuestionMultipleChoice = questiondb.QuestionMultipleChoice;
    answerdb = require("./models/answer"),
    Answer = answerdb.Answer,
    AnswerText = answerdb.AnswerText,
    AnswerMultipleChoice = answerdb.AnswerMultipleChoice, 
    User = require("./models/user");

app.use(express.static("public"));
app.use(methodOverride("_method"));

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
function createMultipleChoice(question){
    var possibleAnswers = [];
    Object.keys(question).forEach(function(key) {
        if(key.includes("answer")){
            console.log('answer found!');
            possibleAnswers.push(question[key]);
        }
    });
    console.log("answers: " + possibleAnswers);
    QuestionMultipleChoice.create({
        title: question.title,
        question: question.question,
        type: "multiplechoice",
        possibleAnswers: possibleAnswers
    }, function(error, question){
        if(error){
            console.log("error: " + error);
        } else{
            console.log("new question multiple: ");
            console.log(question);
        }
    });
};
function createText(question){
    console.log("creating text!");
    QuestionText.create({
        title: question.title, 
        question: question.question,
        type: "text"
    }, function(error, question){
        if(error){
            console.log("error: " + error);
        } else{
            console.log("new question text: ");
            console.log(question);
        }
    });
};
app.post("/questions", function(req, res){
    console.log("type received");
    console.log(req.body.type);
    
    switch(req.body.type){
        case "multiplechoice": {
            createMultipleChoice(req.body);
            break;
        }
        case "text": {
            createText(req.body);
            break;
        }
        default: {
            console.log("something went wrong");
            break;
        }
    }
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
function updateMultipleChoice(id, question){
    var possibleAnswers = [];
    Object.keys(question).forEach(function(key) {
        if(key.includes("answer")){
            console.log('answer found!');
            possibleAnswers.push(question[key]);
        }
    });
    console.log("answers: " + possibleAnswers);
    QuestionMultipleChoice.findByIdAndUpdate(id, {
        title: question.title,
        question: question.question,
        type: "multiplechoice",
        possibleAnswers: possibleAnswers
    }, function(error, question){
        if(error){
            console.log("error: " + error);
        } else{
            console.log("new question multiple: ");
            console.log(question);
        }
    });
};
function updateText(id, question){
    console.log("creating text!");
    QuestionText.findByIdAndUpdate(id, {
        title: question.title, 
        question: question.question,
        type: "text"
    }, function(error, question){
        if(error){
            console.log("error: " + error);
        } else{
            console.log("new question text: ");
            console.log(question);
        }
    });
};
app.put("/questions/:id", function(req, res){
    console.log("PUT RECEIVED");
    console.log(req.body.type);
    switch(req.body.type){
        case "multiplechoice": {
            updateMultipleChoice(req.params.id, req.body);
            break;
        }
        case "text": {
            updateText(req.params.id, req.body);
            break;
        }
        default: {
            console.log("something went wrong");
            break;
        }
    }
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

//PORT:
app.listen(3000, function(){
    console.log('server started');
});