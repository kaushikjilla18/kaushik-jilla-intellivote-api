const express = require('express');
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require('uuid');

//load all the results data from the JSON file
const loadQuestionsData = () => {
    const questions = JSON.parse(fs.readFileSync('./data/results.json', 'utf8'));
    console.log(questions);
    return questions;
}

//post a new question and add to the array of results data
router.post('/', (req, res) => {
    const questionsArr = loadQuestionsData();
    const {question, yes, no} = req.body;
    const newQuestion = {
        qid: questionsArr.length > 0 ? questionsArr.length + 1 : 1,
        question: question,
        yes: yes,
        no: no
    }
    questionsArr.push(newQuestion);
    fs.writeFileSync('./data/results.json', JSON.stringify(questionsArr));

    res.json(questionsArr);
})

//post a new question and add to the array of results data
router.put('/:id?', async (req, res) => {
    const questions = loadQuestionsData(); //read json file
    const questionId = req.params.id;
    const { question, option1, option2 } = req.body;

    // Check if questionId is provided to determine if it's adding a new question or answering an existing one
    if (!questionId) {
        // Adding a new question
        // if (!question || !option1 || !option2) {
        //     return res.status(400).json({ error: 'Please provide question, option1, and option2 in the request body' });
        // }

        if (typeof option1 !== 'number' || typeof option2 !== 'number') {
            return res.status(400).json({ error: 'Option1 and Option2 must be numbers' });
        }
        try {
            // Read the existing data from the JSON file
            //   let jsonData = await fs.readFile(dataFilePath, 'utf8');
            //   let questions = JSON.parse(jsonData);

            // Generate a unique ID for the new question
            const newQuestionId = questions.length > 0 ? questions[questions.length - 1].qid + 1 : 1;

            // Create the new question object
            const newQuestion = {
                // id: uuid(),
                qid: newQuestionId,
                question: question,
                option1: option1,
                option2: option2
            };

            // Add the new question to the existing questions array
            questions.push(newQuestion);

            // Write the updated data back to the JSON file
            await fs.writeFileSync('./data/results.json', JSON.stringify(questions));
            // fs.writeFileSync('./data/results.json', JSON.stringify(questions));

            res.json({ message: `Question added successfully`, newQuestion });
        } catch (error) {
            console.error('Error adding question:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        // Answering an existing question
        const chosenOption = req.body.option;

        try {
            // Find the question to update ;(q.qid === questionId)
            const questionToUpdate = questions.find(q => console.log(q,"question obj"));
            // console.log(questionToUpdate, "question found");
            if (!questionToUpdate) {
                return res.status(404).json({ error: `Question ${questionId} not found` });
            }

            // Increment the chosen option by 1
            if (chosenOption === 'option1') {
                questionToUpdate.option1 += 1;
            } else if (chosenOption === 'option2') {
                questionToUpdate.option2 += 1;
            } else {
                return res.status(400).json({ error: 'Invalid option specified' });
            }

            // Write the updated data back to the JSON file
            await fs.writeFileSync('./data/results.json', JSON.stringify(questions));
            //   fs.writeFile(dataFilePath, JSON.stringify(questions, null, 2));

            res.json({ message: `Answer recorded for Question ${questionId}` });
        } catch (error) {
            console.error('Error recording answer:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// questions.forEach((result, index) => {
//     if (req.body.question === result.question) {
//         newResult.question = result.question;

//     if (req.body.option1) {
//         result.option1 += req.body.option1;
//         newResult.option1 = result.option1;
//         return;
//     }

//     if (req.body.option2) {
//         result.option2 += req.body.option2;
//         newResult.option2 = result.option2;
//     }
// }
// });
// const newQuestion = {
//     id: uuid(),
//     question: newResult.question ? newResult.question : req.body.question,   //ADD A CHECK HERE TO CHECK IF ITS EMPTY OR NOT
//     option1: newResult.option1 ? newResult.option1 : req.body.option1,
//     option2: newResult.option2 ? newResult.option2 : req.body.option2
// }

// questions.push(newQuestion);

// //write new question data to results.json using fs module
// fs.writeFileSync('./data/results.json', JSON.stringify(questions));

// res.send(questions);
// });


// const bodyParser = require('body-parser');
// const fs = require('fs').promises;

// const dataFilePath = 'questions.json';

// app.use(bodyParser.json());

// PUT request handler for adding new question or answering a question
// app.put('/questions/:id?', async (req, res) => {
//   const questionId = req.params.id;
//   const { question, option1, option2 } = req.body;

//   // Check if questionId is provided to determine if it's adding a new question or answering an existing one
//   if (!questionId) {
//     // Adding a new question
//     if (!question || !option1 || !option2) {
//       return res.status(400).json({ error: 'Please provide question, option1, and option2 in the request body' });
//     }

//     if (typeof option1 !== 'number' || typeof option2 !== 'number') {
//       return res.status(400).json({ error: 'Option1 and Option2 must be numbers' });
//     }

//     try {
//       // Read the existing data from the JSON file
//       let jsonData = await fs.readFile(dataFilePath, 'utf8');
//       let questions = JSON.parse(jsonData);

//       // Generate a unique ID for the new question
//       const newQuestionId = questions.length > 0 ? questions[questions.length - 1].id + 1 : 1;

//       // Create the new question object
//       const newQuestion = {
//         id: newQuestionId,
//         question: question,
//         option1: option1,
//         option2: option2
//       };

//       // Add the new question to the existing questions array
//       questions.push(newQuestion);

//       // Write the updated data back to the JSON file
//       await fs.writeFile(dataFilePath, JSON.stringify(questions, null, 2));

//       res.json({ message: `Question added successfully`, question: newQuestion });
//     } catch (error) {
//       console.error('Error adding question:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     // Answering an existing question
//     const chosenOption = req.body.option;

//     try {
//       // Read the existing data from the JSON file
//       let jsonData = await fs.readFile(dataFilePath, 'utf8');
//       let questions = JSON.parse(jsonData);

//       // Find the question to update
//       const questionToUpdate = questions.find(q => q.id === questionId);
//       if (!questionToUpdate) {
//         return res.status(404).json({ error: `Question ${questionId} not found` });
//       }

//       // Increment the chosen option by 1
//       if (chosenOption === 'option1') {
//         questionToUpdate.option1 += 1;
//       } else if (chosenOption === 'option2') {
//         questionToUpdate.option2 += 1;
//       } else {
//         return res.status(400).json({ error: 'Invalid option specified' });
//       }

//       // Write the updated data back to the JSON file
//       await fs.writeFile(dataFilePath, JSON.stringify(questions, null, 2));

//       res.json({ message: `Answer recorded for Question ${questionId}` });
//     } catch (error) {
//       console.error('Error recording answer:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// });



module.exports = router;