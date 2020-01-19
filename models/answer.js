var mongoose = require('mongoose'), 
    questionSchema = require('./questions').questionSchema;

//ANSWERS:
var answerSchema = new mongoose.Schema({
    question: questionSchema,
    //case: text
    text: String,
    //case: multiplechoice
    choice: String
});
var Answer = mongoose.model("Answer", answerSchema, 'answers');

module.exports = {
    answerSchema,
    Answer
}