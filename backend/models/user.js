const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    }
    }, {
    timestamps: true
});
module.exports = mongoose.model('user', userSchema);