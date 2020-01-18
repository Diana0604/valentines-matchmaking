var mongoose = require('mongoose');

//QUESTIONS:
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
var QuestionMultipleChoice = mongoose.model("QuestionMultiplechoice", questionMultiplechoiceSchema, 'questions');

module.exports = {
    Question,
    QuestionText, 
    QuestionMultipleChoice,
    questionSchema,
    questionTextSchema,
    questionMultiplechoiceSchema
}

