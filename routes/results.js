const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require('uuid');

//load all the results data from the JSON file
const loadQuestionsData = () => {
    const questions = JSON.parse(fs.readFileSync('./data/results.json', 'utf8'));
    return questions;
}

//post a new question and add to the array of results data
router.post('/', (req, res) => {
    const questionsArr = loadQuestionsData();
    const { question, yes, no } = req.body;
    const newQuestion = {
        qid: questionsArr.length > 0 ? String(questionsArr.length + 1) : '1',
        question: question,
        yes: yes,
        no: no
    }
    questionsArr.push(newQuestion);
    fs.writeFileSync('./data/results.json', JSON.stringify(questionsArr));

    res.json(questionsArr);
})

//get a single question based on the questions data
router.get('/:id', (req, res) => {
    const questions = loadQuestionsData(); //read json file
    const questionId = req.params.id;
    const selectedQuestion = questions.find(question => question.qid === questionId);
    if (selectedQuestion) {
        res.json(selectedQuestion);
    } else {
        res.status(404).json({ message: "Question not found" });
    }
})

//update the response answer for single question
router.put('/:id?', async (req, res) => {
    const questions = loadQuestionsData(); //read json file
    const qid = req.params.id;
    const { incrementYes, incrementNo } = req.body;

    const questionIndex = questions.findIndex(question => question.qid === qid);

    if (questionIndex) {
        if (incrementYes) {
            questions[questionIndex].yes += 1;
        }
        if (incrementNo) {
            questions[questionIndex].no += 1;
        }
        //Write the updated data back to the JSON file
        fs.writeFileSync('./data/results.json', JSON.stringify(questions));
        res.json(questions[questionIndex]);
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
});

module.exports = router;