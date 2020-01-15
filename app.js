var express = require("express"),
    app = express(),
     bodyParser = require('body-parser'),
     mongoose = require('mongoose');

app.use(express.static("public"));



mongoose.connect("mongodb://localhost/valentine", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});


//schema setup
var questiomSchema = new mongoose.Schema({
    title: String, 
    question: String,
    questionType: String,
    number: Number
});
var Question = mongoose.model("Question", questiomSchema);
/*
Question.create(
    {
        title: "Question 1",
        question: "What do you think about this test?",
        questionType: "text",
        number: 1
    }, function(err, question){
        if(err){
            console.log("Error: " + err);
        } else {
            console.log("neq question added: ");
            console.log(question);
        }
    }
);

Question.create(
    {
        title: "Question 2",
        question: "Are you ready to find true love?",
        questionType: "text",
        number: 2
    }, function(err, question){
        if(err){
            console.log("Error: " + err);
        } else {
            console.log("neq question added: ");
            console.log(question);
        }
    }
);*/

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//INDEX:
app.get("/", function(req, res){
    res.render("index");
});
app.get("/test", function(req, res){
    res.render("index");
});
//MANAGE QUESTIONS
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
//ANSWER QUESTIONS
app.get("/test/finish", function(req, res){
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
    console.log(req.params.answer);
    var nextQ = Number(req.params.answer) + 1;
    console.log(req.body.answer);
    console.log("nest question: " + nextQ);
    res.redirect("test/" + nextQ);
});
//GENERIC
app.get("*", function(req, res){
    res.send('this page does not exists');
});
//PORT
app.listen(3000, function(){
    console.log('server started');
    
});