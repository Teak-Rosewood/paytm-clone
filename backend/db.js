const mongoose = require("mongoose");

url = "mongodb://localhost:27017/paytm";
mongoose.connect(url);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        required: true,
        trim: true,
        type: String,
        maxLength: 50,
    },
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
});

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("user", userSchema);

module.exports = {
    User,
    Account,
};
