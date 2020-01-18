var mongoose = require('mongoose');

//QUESTIONS:
var questionSchema = new mongoose.Schema({
    title: String, 
    question: String,
    type: String,
    //multiple choice
    possibleAnswers: [String]
});
var Question = mongoose.model("Question", questionSchema, 'questions');

module.exports = {
    questionSchema,
    Question
}

