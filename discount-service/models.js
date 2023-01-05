const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    points: Number,
});

const discountSchema = new mongoose.Schema({
    code: String,
    discount: Number,
});

const User = mongoose.model('user', userSchema);
const Discount = mongoose.model('discount', discountSchema);
 
module.exports = {
    User,
    Discount,
}