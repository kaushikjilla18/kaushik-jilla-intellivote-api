const express = require('express');
const app = express();
const fs = require('fs');
const questionsRoute = require('./routes/results');
const quizQuestionsRoute = require('./routes/quiz');
const cors = require('cors');

const PORT = process.env.PORT || 5050;

//middleware
app.use(cors());                        //to allow cors
app.use(express.json());                //parse the json

//use middleware to setup questionsRoute
app.use('/questions', questionsRoute);

//use middleware to setup quiz questionsRoute
app.use('/quiz', quizQuestionsRoute);

//basic mock home route
app.get('/', (req, res) => {
    res.json({
        message: 'Hey there! This is Intellivote Express server'
    });
});

//boot up the server
app.listen(PORT, () => { console.log(`app is running at http://localhost:${PORT}`) });