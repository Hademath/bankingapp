"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
        max: [11, { message: "Phone number must be 11 digit" }]
    },
    password: {
        type: String,
        required: true,
        max: [6, { msg: "minimum of 6" }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('User', UserSchema);
exports.default = User;
