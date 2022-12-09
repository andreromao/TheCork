const mongoose = require('mongoose')
const models = require('./models');

const url = "mongodb://localhost:27017/myReservations"

mongoose.set('strictQuery', true)

mongoose.connect(url, {})
    .then(result => console.log("db connected"))
    .catch(err => console.log(err))

async function getReservations(){
    var reservations = []

    await models.Reservation.find()
        .then(data => {
            console.log("Reservations: ")
            console.log(data)
            
            // Putting all reservation in reservations array
            data.map((d, k) => {
                reservations.push(d)
            })
        })
        .catch(error => {
            console.log(error);
        })

    return reservations
}

module.exports.getReservations = getReservations;

