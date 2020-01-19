var mongoose = require("mongoose");
var Question = require("./models/questions").Question;
 
var data = [
    {
        title: "Question 1", 
        question: "What are you expecting from this test?",
        type: "multiplechoice",
        possibleAnswers: ["To find true love", "A friend with benefits ;)", "Friendship", "Dunno"]
    },
    {
        title: "Question 2",
        question: "Tell us more about yourself", 
        type: "text",
    },
    {
        title: "Question 3",
        text: "Did you like the test?", 
        type: "multiplechoice", 
        possibleAnswers: ["YES", "NO"]
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Question.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed questions!");
        //add a few campgrounds
        data.forEach(function(seed){
            Question.create(seed, function(err, question){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a question");
                }
            });
        });
    });
}
 

module.exports = seedDB;