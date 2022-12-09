const express = require('express')
const models = require('./models');
const mongodb = require('./mongodb')

const port = 3000;
const app = express()

app.get('/', (req, res) => {
    res.send("<h1>Hello from nodeJS app</h1>")
})

app.get('/reservations', async (req, res) => {

    var reservations = await mongodb.getReservations()

    res.send(
        reservations.map(reservation =>
            `<h1>${reservation.name} ${reservation.restaurant}</h1><br>`
        ).join('')
    )
})

app.listen(port, () => {
    console.log("server is running at port " + port)
})