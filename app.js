var express = require("express");
var app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');

function startApp(){
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");

    app.get("/", function(req, res){
        res.render("index");
    });
    app.get("/test", function(req, res){
        res.render("index");
    });
    app.get("/test/finish", function(req, res){
        res.render("finish");
    });
    app.get("/test/:question", function(req, res){
        var questionNumber = Number(req.params.question) - 1;
        questions = [
            {
                title: "Question 1",
                question: "What do you think about this test?",
                questionType: "input"
            }
        ];
        if(questionNumber < questions.length){
            res.render("test", {question:questions[questionNumber]});
        } else{
            res.redirect("/test/finish");
        }
    });
    app.post("/:answer", function(req, res){
        console.log(req.params.answer);
        var nextQ = Number(req.params.answer) + 1;
        console.log(req.body.answer);
        console.log("nest question: " + nextQ);
        res.redirect("test/" + nextQ);
    });
    app.get("*", function(req, res){
        res.send('this page does not exists');
    });

    app.listen(3000, function(){
        console.log('server started');
        
    });
}

startApp();