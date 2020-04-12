const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    username:{type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    city: {type: String, required: true},
    gender: {type: Number},
    phone: {type: String, required: true},
    createdDate: {
        type: Date,
        default: Date.now

    }


});


const User = mongoose.model("User", userSchema, 'user');
exports.User = User;