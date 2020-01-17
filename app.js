var express = require("express"),
    app = express(),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/valentine", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//constants
var VALIDTYPE = new Set();
VALIDTYPE.add("text");

//SCHEMA SETUP:
/*
var users = mongoose.model('User', loginUserSchema, 'users');
var registerUser = mongoose.model('Registered', registerUserSchema, 'users');
*/
var questionSchema = new mongoose.Schema({
    title: String, 
    question: String,
    type: String,
    possibleAnswers: [String]
});
var questionTextSchema = new mongoose.Schema({
    title: String, 
    question: String,
    type: String
});
var questionMultiplechoiceSchema = new mongoose.Schema({
    title: String, 
    question: String, 
    type: String, 
    possibleAnswers: [String]
});
var Question = mongoose.model("Question", questionSchema, 'questions');
var QuestionText = mongoose.model("QuestionText", questionTextSchema, 'questions');
var QuestionMultipleChoice = mongoose.model("QuestionMultiplechoiceSchema", questionMultiplechoiceSchema, 'questions');

//answers
var answerSchema = new mongoose.Schema({
    number: Number,
    answer: String},
    {_id: false});
var answersListSchema = new mongoose.Schema({
    answers: [answerSchema]
});

var Answer = mongoose.model("Answer", answerSchema);
var AnswersList = mongoose.model("AnswersList", answersListSchema);

var answersListAux = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
    Object.keys(question).forEach(function(key,index) {
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
    Question.find({_id: req.params.id}, function(err, question){
        if(err){
            console.log("error: ");
            console.log(err);
            res.send('something went wrong');
        } else{
            console.log(question);
            res.send(question);
        }
    })
});
//EDIT
app.get("/questions/:id/edit", function(req, res){
    Question.find({_id: req.params.id}, function(err, questions){
        if(err){
            console.log(err);
            res.send("something went wrong");
        } else{
            console.log("editing question: "); 
            console.log(questions[0]);
            console.log(questions[0].possibleAnswers);
            console.log('SENDING TO EDIT');
            res.render("editquestion", {question:questions[0]});
        }
    });
})
//UPDATE
//DESTROY
/*
//MANAGE QUESTIONS:
//create new question
app.get("/questions/new", function(req, res){
    res.render("newquestion");
});
app.post("/settype", function(req, res){
    var type = req.body.type;
    res.redirect("/questions/new/" + type);
});
app.get("/questions/new/:type", function(req, res) {
    var type = req.params.type;
    if(VALIDTYPE.has(type)){
        newQuestionType = req.params.type;
        res.render(req.params.type);
    } else{
        res.send("not a valid question type");
    }
});
app.post("/questions", function(req, res){
    console.log("new question");
    var title = req.body.title;
    var question = req.body.question;
    var questionType = newQuestionType;
    console.log("title: " + title);
    console.log("question: " + question);
    console.log("question type: " + questionType);
    Question.find({}, function(err, questions){
        if(err){
            console.log("ERROR! " + err);
        } else{
            var number = questions.length + 1;
            Question.create({
                title: title,
                question: question,
                questionType: questionType,
                number: Number(number)
            }, function(err, question){
                if(err){
                    console.log("ERROR: " + err);
                } else{
                    console.log("new question added: " + question);
                }
            });
        }
    });
    newQuestionType = "";
    res.redirect("/questions/new");
});

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