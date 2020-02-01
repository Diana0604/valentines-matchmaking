var express = require('express'),
    router = express.Router(),
    isAdmin = require('../common').isAdmin,
    Question = require('../models/questions').Question;

//INDEX:
router.get("/questions", isAdmin, function(req, res){
    Question.find({}, function(err, questions){
        if(err){
            console.log('could not load questions!');
        } else{
            res.render("questions", {questions:questions});
        }
    });
});
//NEW:
router.get("/questions/new", isAdmin, function(req, res){
    res.render("newquestion");
});
//CREATE:
router.post("/questions", isAdmin, function(req, res){
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
router.get("/questions/:id", isAdmin, function(req, res){
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
router.get("/questions/:id/edit", isAdmin, function(req, res){
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
router.put("/questions/:id", isAdmin, function(req, res){
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
router.delete("/questions/:id", isAdmin, function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error: " + err);
            res.send("something went wrong");
        } else{
            res.redirect("/questions");
        }
    });
});


module.exports = router;
