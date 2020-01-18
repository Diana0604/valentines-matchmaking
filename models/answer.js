var mongoose = require('mongoose'), 
    questionSchema = require('./questions').questionSchema,
    questionTextSchema = require('./questions').questionTextSchema,
    questionMultiplechoiceSchema = require('./questions').questionMultiplechoiceSchema;

//ANSWERS:
var answerSchema = new mongoose.Schema({
    question: questionSchema,
    text: String,
    choice: Number,
    type: String
});
var answerTextSchema = new mongoose.Schema({
    question: questionTextSchema,
    text: String,
    type: String
});
var answerMultipleChoiceSchema = new mongoose.Schema({
    question: questionMultiplechoiceSchema, 
    choice: Number,
    type: String
});
var Answer = mongoose.model("Answer", answerSchema, 'answers');
var AnswerText = mongoose.model("AnswerText", answerTextSchema, 'answers');
var AnswerMultipleChoice = mongoose.model("AnswerMultipleChoice", answerMultipleChoiceSchema, 'answers');

module.exports = {
    Answer,
    AnswerText, 
    AnswerMultipleChoice,
    answerSchema
}