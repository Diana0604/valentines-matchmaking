var express = require('express'),
    router = express.Router(),
    isLoggedIn = require('../common').isLoggedIn,
    Question = require('../models/questions').Question,
    Answer = require('../models/answer').Answer,
    User = require('../models/user');

router.get("/test", isLoggedIn, function(req, res){
    //1 check if user has already answered test
    if(req.user.answerList && req.user.answerList.length > 0){
        res.send('are you trying to cheat?! Don\'t answer the test again!');
    } else{
        //2 go to test
        Question.find({}, function(err, questions){
            if(err){
                console.log("error");
                res.send("error");
            } else{
                res.render("test", {questions: questions});
            }
        });
    }
});
//this spagheti code MUST be reviewed
router.post("/test", function(req, res){
    var newUser = req.user;
    newUser.answerList = [];
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
router.get("/test/finish", isLoggedIn, function(req, res){
    res.render("finish");
});
module.exports = router;