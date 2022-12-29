const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const models = require('./models');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL, {}).then(() => console.log("db connected"));

app.get('/', (req, res) => {
    res.send("<h1>Hello from nodeJS app</h1>");
})

app.get('/reservations', async (req, res) => {
    const reservations = await models.Reservation.find().catch(console.error);
    console.log(reservations);
    res.send(reservations);
})

app.get('/restaurants', async (req, res) => {
    const restaurants = await models.Restaurant.find().catch(console.error);
    console.log(restaurants);
    res.send(restaurants);
})

app.post('/reserve', async (req, res) => {
    console.log(req.body);
    const reservation = new models.Reservation(req.body);

    let error;
    if (!reservation.name || !reservation.restaurant || !reservation.people || !reservation.date) {
        error = "Missing required fields";
    } else if (reservation.people < 1) {
        error = "Invalid number of people";
    } else if (reservation.date < new Date()) {
        error = "Invalid date";
    }
    await models.Reservation.find({
        restaurant: reservation.restaurant,
        name: reservation.name,
        date: reservation.date,
    }).then((reservations) => {
        if (reservations.length > 0) {
            error = "There is already a reservation under this name for this slot";
        }
    }).catch(console.error);

    // TODO check if restaurant exists and use id instead of slug
    // TODO check if date is valid

    if (error) {
        res.status(400).send(error);
        return;
    }

    reservation.status = "pending";
    reservation.save().then(() => {
        res.status(200).send("Reservation saved");
    }).catch((err) => {
        console.error(err);
        res.status(400).send("An error occurred");
    });
})

app.listen(port, () => {
    console.log("server is running at port " + port);
})