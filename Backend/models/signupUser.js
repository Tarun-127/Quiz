const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    quizCreated: {
        type: Number,
        default: 0
    },
    questionsCreated: {
        type: Number,
        default: 0
    },
    totalImpressions: {
        type: Number,
        default: 0
    }
    
})
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;