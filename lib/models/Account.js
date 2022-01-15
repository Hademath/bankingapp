"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "User"
    },
    account_number: {
        type: Number,
        maxlenght: [10, "account number is required"],
        unique: true
    },
    balance: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });
const balances = mongoose_1.default.model('balances', AccountSchema);
exports.default = balances;
