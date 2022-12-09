const mongoose = require('mongoose')

// Reservation Modal Schema
const reservationSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    restaurant: String,
});

// Creating model objects
const Reservation = mongoose.model('reservation', reservationSchema);
 
// Exporting our model objects
module.exports = {
    Reservation
}