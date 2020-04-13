const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema ({
    transaction_type: {type: String, required: true},
    amount: {type: String, required: true},
    accountNo: {type: String, required: true},
    createdDate: {
        type: Date,
        default: Date.now

    }


});


const Account = mongoose.model("Account", accountSchema, 'account');
exports.Account = Account;