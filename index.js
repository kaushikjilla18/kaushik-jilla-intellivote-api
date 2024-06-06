const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');

const port = 5050;

//middleware
// app.use(express.static("public"));      //load images from public folder
app.use(cors());                        //to allow cors
app.use(express.json());                //parse the json

//use middleware to setup videosRoute
// app.use('/videos', videosRoute);

//basic mock home route
app.get('/', (req, res) => {
    res.json({
        message: 'Hey there! This is Intellivote Express server'
    });
});

//boot up the server
app.listen(port, () => { console.log(`app is running at http://localhost:${port}`) });