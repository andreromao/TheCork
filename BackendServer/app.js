const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const models = require('./models');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
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
    const reservations = await models.Reservation.find({
        restaurant: req.query.restaurant,
        date: {
            $gte: new Date(),
        },
    }).catch(console.error);
    console.log(reservations);
    res.send(reservations);
})

app.get('/user-reservations', async (req, res) => {
    const reservations = await models.Reservation.find({
        username: req.query.username, // TODO: derive username from token
        date: {
            $gte: new Date(),
        },
    }).catch(console.error);
    for (let i = 0; i < reservations.length; i++) {
        const restaurant = await models.Restaurant.findOne({
            slug: reservations[i].restaurant,
        }).catch(console.error);
        reservations[i].restaurant = restaurant.name;
    }
    console.log(reservations);
    res.send(reservations);
})

app.get('/restaurants', async (req, res) => {
    const restaurants = await models.Restaurant.find().catch(console.error);
    console.log(restaurants);
    res.send(restaurants);
})

app.get('/schedule', async (req, res) => {
    const schedule = await models.Schedule.findOne({
        restaurant: req.query.restaurant,
    }).catch(console.error);
    console.log(schedule);
    res.send(schedule);
})

app.post('/schedule', async (req, res) => {
    console.log(req.body);
    if (!req.body.restaurant) {
        res.status(400).send("Missing required fields");
        return;
    }
    await models.Schedule.findOneAndUpdate({
        restaurant: req.body.restaurant,
    }, req.body, {
        upsert: true,
    }).then(() => {
        res.status(200).send("Schedule saved");
    }).catch((err) => {
        console.error(err);
        res.status(400).send("An error occurred");
    });
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
    } else {
        await models.Reservation.find({
            restaurant: reservation.restaurant,
            name: reservation.name,
            date: reservation.date,
        }).then((reservations) => {
            if (reservations.length > 0) {
                error = "There is already a reservation under this name for this slot";
            }
        }).catch(console.error);
        await models.Schedule.findOne({
            restaurant: reservation.restaurant,
        }).then((schedule) => {
            if (!schedule) {
                error = "This restaurant does not exist";
            } else {
                const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                const times = schedule[weekDays[reservation.date.getDay()]];
                const time = reservation.date.getHours() + ":" + reservation.date.getMinutes().toString().padStart(2, "0");
                if (!times.includes(time)) {
                    error = "This reservation is not available";
                }
            }
        }).catch(console.error);
    }

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

app.post('/change-status', async (req, res) => {
    console.log(req.body);
    if (!req.body.id || !req.body.status) {
        res.status(400).send("Missing required fields");
        return;
    }
    await models.Reservation.findOneAndUpdate({
        _id: req.body.id,
    }, {
        status: req.body.status,
    }).then(() => {
        res.status(200).send("Status changed");
    }).catch((err) => {
        console.error(err);
        res.status(400).send("An error occurred");
    });
})

https.createServer({
    key: fs.readFileSync('.cert/key.pem'),
    cert: fs.readFileSync('.cert/cert.pem')
}, app).listen(port, () => {
    console.log("server is running at port " + port);
})