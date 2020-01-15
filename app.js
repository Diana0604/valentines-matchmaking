var express = require("express"),
    app = express(),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/valentine", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//SCHEMA SETUP:
//questions
var questiomSchema = new mongoose.Schema({
    title: String, 
    question: String,
    questionType: String,
    number: Number
});
var Question = mongoose.model("Question", questiomSchema);
//answers

//var childSchema = new Schema({ name: String }, { _id: false });
//var parentSchema = new Schema({ children: [childSchema] });
var answerSchema = new mongoose.Schema({
    answers: [{
        number: Number,
        answer: String
    }, 
    {   
        _id: false
    }]
});
var Answer = mongoose.model("Answer", answerSchema);

var auxAnswer = [];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//INDEX:
app.get("/", function(req, res){
    res.render("index");
    auxAnswer = [];
});
app.get("/test", function(req, res){
    res.render("index");
    auxAnswer = [];
});
//MANAGE QUESTIONS:
app.get("/manage/newquestion", function(req, res){
    res.render("newquestion");
});
app.post("/addquestion", function(req, res){
    console.log("new question");
    var title = req.body.title;
    var question = req.body.question;
    var questionType = req.body.type;
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
    res.redirect("/manage/newquestion");
});
//ANSWER QUESTIONS:
app.get("/test/finish", function(req, res){
    Answer.create({
        answers: auxAnswer
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
    var newAnswer = {
        number: req.params.answer,
        answer: req.body.answer
    }
    auxAnswer.push(newAnswer);
    var nextQ = Number(req.params.answer) + 1;
    res.redirect("test/" + nextQ);
});
//GENERIC:
app.get("*", function(req, res){
    res.send('this page does not exists');
});
//PORT:
app.listen(3000, function(){
    console.log('server started');
    
});