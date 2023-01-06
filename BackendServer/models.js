import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    name: String,
    username: String,
    restaurant: String,
    people: Number,
    date: Date,
    status: String,
    discount: Object,
});

const restaurantSchema = new mongoose.Schema({
    slug: String,
    name: String,
    address: String,
    image: String,
    lat: Number,
    long: Number,
});

const scheduleSchema = new mongoose.Schema({
    restaurant: String,
    sunday: [String],
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
});

const Reservation = mongoose.model('reservation', reservationSchema);
const Restaurant = mongoose.model('restaurant', restaurantSchema);
const Schedule = mongoose.model('schedule', scheduleSchema);
 
export const models = {
    Reservation,
    Restaurant,
    Schedule,
}