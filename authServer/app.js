const express = require('express')
const mongoose = require('mongoose')
const models = require('./models');
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser");
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const crypto = require ("crypto");
const { access } = require('fs');
require('dotenv').config();

const port = 4000;
const app = express();
app.use(cors());
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

    models.User.findOne({username:req.body.username}, async function(err, user) {
        if (err) { res.status(500).send("Internal Server error occured") }
        if (user) {
            bcrypt
            .compare(req.body.password, user.passHash)
            .then(cmp => {
                if (cmp) {
                   
                    const accessToken=generateAccessToken(req.body.username)
                    user.refreshToken= generateRefreshToken(req.body.username)
                    console.log(user)
                   res.status(200).send(accessToken);
                } else {
                    res.status(400).send("Wrong password");
                }
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send("Internal Server error occured");
            })
        } else {
            res.status(400).send("Username does not exist");
        }
    })
})

function generateAccessToken (username){
    // TODO: add role to payload
    const payload ={name:username, exp : Date.now()+1}
    const buff= new Buffer(JSON.stringify(payload))
    const base64data=buff.toString('base64')
    var hash = crypto.createHmac('SHA256', process.env.ACCESS_TOKEN_SECRET).update(base64data).digest('base64')
    
    return base64data+"."+hash
}
function generateRefreshToken(username){
    
    const payload ={username}
    const buff= new Buffer(JSON.stringify(payload))
    const base64data=buff.toString('base64')
    var hash = crypto.createHmac('SHA256', process.env.ACCESS_TOKEN_SECRET).update(base64data).digest('base64')
    return base64data+"."+hash
}



app.post('/register', async (req, res) => {
    console.log(req.body);
    const newUser = new models.User(req.body);
    
    if(!req.body.password || !req.body.username) {
        res.status(400).send("Missing username or password");
        return;
    }

    models.User.findOne({name:req.body.username}, async function(err, user) {
        if (err) { res.status(500).send("Internal Server error occured") }
        if (!user) {
            bcrypt
            .hash(req.body.password, saltRounds)
            .then(hash => {
                newUser.username = req.body.username
                newUser.passHash = hash
                newUser.refreshToken=" "
               
                newUser.save().then(() => {
                    res.status(200).send("User registered");
                }).catch((err) => {
                    console.error(err);
                    res.status(500).send("An error occurred");
                });
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send("Internal Server error occured");
            })
        } else {
            res.status(400).send("Username already exists");
        }
    })
})

https.createServer({
    key: fs.readFileSync('.cert/key.pem'),
    cert: fs.readFileSync('.cert/cert.pem')
}, app).listen(port, () => {
    console.log("server is running at port " + port);
})