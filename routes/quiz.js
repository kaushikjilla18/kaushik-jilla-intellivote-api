const express = require('express');
const router = express.Router();
const fs = require("fs");

//load all the results data from the JSON file
const loadQuizData = () => {
    const quizQuestions = JSON.parse(fs.readFileSync('./data/quiz.json', 'utf8'));
    // console.log(quizQuestions);
    return quizQuestions;
}

//to get single question using question_id
router.get('/:id', (req, res) => {
    console.log(req.params.id, "params id");
    const questionsArr = loadQuizData();
    const foundQuestion = questionsArr.find((question) => question.question_id === req.params.id);
    console.log(foundQuestion);
    res.json(foundQuestion);
})

module.exports = router;