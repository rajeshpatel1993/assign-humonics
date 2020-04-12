const mongoose = require('mongoose');

const userSchema = new mongoose.Schema ({
    username:{type: String, required: true},
    email: {type: String,unique: true ,required: true},
    password: {type: String, required: true},
    city: {type: String, required: true},
    gender: {type: Number},
    phone: {type: String, required: true, unique: true},
    accountNo: {type: Number, required: true, unique: true},
    createdDate: {
        type: Date,
        default: Date.now

    }


});


const User = mongoose.model("User", userSchema, 'user');
exports.User = User;