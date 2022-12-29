const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    restaurant: String,
    people: Number,
    date: Date,
});

const restaurantSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    address: String,
    image: String,
    lat: Number,
    long: Number,
});

const Reservation = mongoose.model('reservation', reservationSchema);
const Restaurant = mongoose.model('restaurant', restaurantSchema);
 
module.exports = {
    Reservation,
    Restaurant
}