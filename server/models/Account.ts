import { NextFunction } from 'express';
import mongoose from 'mongoose';


const AccountSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId, ref:"User"
},
account_number: {
    type: Number,
    maxlenght: [10, "account number is required"],
    unique:true
  },
  balance: {
    type: Number
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }
},
{timestamps:true}
);

const balances = mongoose.model('balances', AccountSchema);
export default balances
