import { NextFunction } from 'express';
import mongoose from 'mongoose';
     
// reference: uuidv4(),
//               senderAccount: user.account_number,
//               amount,
//               receiverAccount,
//               transferDescription,
const AccountSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
transferDescription: {
    type: String,
    unique:true 
  },
  reference: {
    type: String,
    unique:true 
  },
  senderAccount: {
    type: Number,
    ref:"balances"
  },
  amount: {
    type: String,
  },
  receiverAccount: {
    type: Number,
  },
},
{timestamps:true}
);

const transaction = mongoose.model('transaction', AccountSchema);
export default transaction;
