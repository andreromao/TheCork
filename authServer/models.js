const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    passHash: String,
    role: String,
    refreshToken: String
});

const User = mongoose.model('user', userSchema);
 
module.exports = {
    User,
}