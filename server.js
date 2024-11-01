const express = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend } = require("./helpers/fsUtils");


// setting the port on which express application will start
const PORT = process.env.PORT || 3000;

// initializing the app to express
const app = express();

// data will parsed in the JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get("/api/notes", (request, response) => {
    readFromFile("./db/db.json")
        .then((data) => response.json(JSON.parse(data)));
})

app.post("/api/notes", (request, response) => {
    const { title, text } = request.body;

    if (request.body) {
        const newNote = {
            id: uuidv4(),
            title,
            text
        }
        readAndAppend(newNote, "./db/db.json")
            .then((data) => response.json(JSON.parse(data)));
    } else {
        response.json("Error in adding note");
    }
})



// starting the  app on th the port defined above
app.listen(PORT, () => {
    console.log(`Application started on http://localhost:${PORT}`)
})