const express = require('express')
const mongoose = require('mongoose')
const models = require('./models');
const bodyParser = require("body-parser");
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL, {}).then(() => console.log("db connected"));

const POINTS_TO_REDEEM = 25;

app.get('/', (req, res) => {
    res.send("<h1>Hello from discount service</h1>");
});

function checkAuth(req, res, next) {
    const header = req.headers['authorization'].split(' ')[1]
    if (!header) return res.status(401).send("Headers missing")
    console.log(header, process.env.API_TOKEN)
    if (header !== process.env.API_TOKEN) return res.status(403).send("Invalid token")
    next()
}

app.get('/validate', checkAuth, async (req, res) => {
    const { code } = req.query;
    const discount = await models.Discount.findOne({ code: code });
    if (discount) {
        res.send(discount);
    } else {
        res.status(404).send("Discount code not found");
    }
});

app.get('/user-points', checkAuth, async (req, res) => {
    const { username } = req.query;
    const user = await models.User.findOne({ username: username });
    res.send(user ? { points: user.points } : { points: 0 });
});

app.post('/redeem-points', checkAuth, async (req, res) => {
    const { username } = req.body;
    const user = await models.User.findOne({ username: username });
    if (user && user.points >= POINTS_TO_REDEEM) {
        const discount = new models.Discount({
            code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            discount: 20,
        });
        await discount.save();
        user.points -= POINTS_TO_REDEEM;
        await user.save();
        res.send(discount);
    } else {
        res.status(400).send("Not enough points");
    }
});

app.post('/add-points', checkAuth, async (req, res) => {
    const { username, points } = req.body;
    const user = await models.User.findOne({ username: username });
    if (user) {
        user.points += points;
        await user.save();
        res.send(user);
    } else {
        const newUser = new models.User({
            username: username,
            points: points,
        });
        await newUser.save();
        res.send(newUser);
    }
});

https.createServer({
    key: fs.readFileSync('.cert/key.pem'),
    cert: fs.readFileSync('.cert/cert.pem')
}, app).listen(port, () => {
    console.log("server is running at port " + port);
});