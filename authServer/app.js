const express = require('express')
const mongoose = require('mongoose')
const models = require('./models');
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser");
require('dotenv').config();

const port = 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const saltRounds = 10

mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL, {}).then(() => console.log("db connected"));

app.get('/', (req, res) => {
    res.send("<h1>Hello from auth server</h1>");
})

app.post('/login', (req, res) => {
    console.log(req.body);

    if(!req.body.password || !req.body.username) {
        res.status(400).send("Missing username or password");
        return;
    }

    models.User.findOne({name:req.body.username}, async function(err, user) {
        if (err) { res.status(500).send("Internal Server error Occured") }
        if (user) {
            bcrypt
            .compare(req.body.password, user.passHash)
            .then(cmp => {
                if (cmp) {
                    // TODO: generate and send auth token
                    res.status(200).send("Logged in");
                } else {
                    res.status(400).send("Wrong password");
                }
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send("Internal Server error Occured");
            })
        } else {
            res.status(400).send("Username doesn't exists");
        }
    })
})

app.post('/register', async (req, res) => {
    console.log(req.body);
    const registingUser = new models.User(req.body);
    
    if(!req.body.password || !req.body.username) {
        res.status(400).send("Missing username or password");
        return;
    }

    models.User.findOne({name:req.body.username}, async function(err, user) {
        if (err) { res.status(500).send("Internal Server error Occured") }
        if (!user) {
            bcrypt
            .hash(req.body.password, saltRounds)
            .then(hash => {
                registingUser.passHash = hash
                registingUser.save().then(() => {
                    res.status(200).send("User registered");
                }).catch((err) => {
                    console.error(err);
                    res.status(500).send("An error occurred");
                });
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send("Internal Server error Occured");
            })
        } else {
            res.status(400).send("Username already exists");
        }
    })
})

app.listen(port, () => {
    console.log("server is running at port " + port);
})