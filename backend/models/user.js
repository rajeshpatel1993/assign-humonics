const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    username:{type: String, required: true},
    email: {type: String,unique: true ,required: true},
    password: {type: String, required: true},
    city: {type: String, required: true},
    gender: {type: Number},
    phone: {type: String, required: true, unique: true},
    accountNo: {type: String, required: true, unique: true},
    otp:{type: String},
    createdDate: {
        type: Date,
        default: Date.now

    }


});


const User = mongoose.model("User", userSchema, 'user');
exports.User = User;