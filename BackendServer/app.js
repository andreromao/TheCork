const express = require('express')
const mongoose = require('mongoose')
const models = require('./models');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

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

app.listen(port, () => {
    console.log("server is running at port " + port);
})