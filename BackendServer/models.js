const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    name: String,
    restaurant: String,
    people: Number,
    date: Date,
    status: String,
});

const restaurantSchema = new mongoose.Schema({
    slug: String,
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