"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// reference: uuidv4(),
//               senderAccount: user.account_number,
//               amount,
//               receiverAccount,
//               transferDescription,
const AccountSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    transferDescription: {
        type: String,
        unique: true
    },
    reference: {
        type: String,
        unique: true
    },
    senderAccount: {
        type: Number,
        ref: "balances"
    },
    amount: {
        type: String,
    },
    receiverAccount: {
        type: Number,
    },
}, { timestamps: true });
const transaction = mongoose_1.default.model('transaction', AccountSchema);
exports.default = transaction;
