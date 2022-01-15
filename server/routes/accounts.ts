import express, { NextFunction, Request, Response } from 'express';
import User from "../models/User";
import balances from '../models/Account';
import { transferValidation} from '../utilis/usersValidation';
import transaction from '../models/Transaction';
import {v4 as uuidv4} from 'uuid'
import {authFunc} from "../middleware/auth"


//console.log(User);


const router = express.Router(); 


router.post('/create-account', authFunc, function(req:Request, res:Response) {
  User.findOne({email: req.body.email}, async (err:any, user:any )=>{
    if(err)
      return  res.status(404).json({
        message:"error occurred why registering",
      })
      //console.log(user)
      //check if account number exist in the balances collection, if not created then do
      const checkAccounNumber = await balances.findOne().sort({createdAt:-1}).limit(1)
        if(checkAccounNumber == null){
          await balances.create({
            userId: user._id, 
            account_number: 1234567890,
            balance: 5000,
          })
          return res.json({message:"the account can't be null"});
        }else{
          if (checkAccounNumber.userId.equals(user._id)){
             res.status(400).json({
               message: `You have already created an account.  ${checkAccounNumber.account_number}`
             })
          }else{
            await balances.create({
              userId:user._id,
              account_number:Number(checkAccounNumber.account_number +2),
              balance:5000,
            })
            return res.status(200).json({message:`Account created successfuly. Thanks for choosen us`})
          }
        }

  })

}); 


router.post('/transfer',authFunc,  function(req:Request, res:Response) {
       /*   ************************* Check and validate the user input to transfer money* */
       
  try {
    const { amount, receiverAccount, senderAccount, transferDescription } = req.body;
    const { error } = transferValidation(req.body);
    if (error)
    if(error) return res.status(400).json({ error: error.details[0].message })
    /// get balance
    balances.findOne(
      {account_number: Number(senderAccount) }, async (err: any, user: any) => {
        if(err)
          return res.status(404).json({ msg: "Account Number does not exist" });
        if(user) {
          // reciever account equal sender account
          if(user.account_number == req.body.receiverAccount)
            return res.json({ msg: "Provide reciever account And not yours" });
          if(Number(user.balance) < Number(amount)) {
            return res.status(404).json({
              msg: "Insufficient Balance in your account",
            });
          } else {
            //send to the reciever
            await transaction.create({ 
              reference: uuidv4(),
              senderAccount: user.account_number,
              amount,
              receiverAccount,
              transferDescription,
            }); 
            // find Reciever current  balance and update the  account
            const reciever_Prev_Balance = await balances.findOne({
              account_number: receiverAccount,
              
            });
            await balances.updateOne(
              { account_number: receiverAccount },
              {$set: {balance: Number(reciever_Prev_Balance.balance) + Number(amount) },
                      $currentDate: { lastModified: true },
              });
            // use this to Update the sender's balance by removing the amount he want to send
            await balances.updateOne(
              { account_number: user.account_number },
              {
                $set: {balance: Number(user.balance) - Number(amount) },
                $currentDate: { lastModified: true },
              }
            );
            res.status(200).json({ msg: "Transaction Successful" });
          }
          //perform transfer as follow

        } else { 
         return res  
            .status(404)  
            .json({ msg: "Incorrect account number" });
        }
      } 
    );
  } catch (error) { 
    res.status(404).json("Something serious went wrong")
  } 
})



/************************ Get Account Balance with User Account Number *****************************/
router.get('/balance/:account_number', authFunc, ( req: Request, res: Response, next: NextFunction) => {
  try {
    let account = req.params.account_number;
    balances.findOne({ account_number: account }, (err: any, user_balance: any) => {
      if(err) {
        return  res.json({ msg: "we are unable to fetch the balance"});
      }
      if(user_balance) { return res.status(200)
         .json({ msg: `Account balance:  ${user_balance.balance}` });
      }else{
        res.json({msg:"Invalid Account Number"})
      }
    });
  } catch (err: any) {
    //console.log(err)
    res.status(500).json("error occured")

  }
})


/************************** Get Account Balance with User ID ***********************/
router.get('/balances/:userId', authFunc,  (req: Request, res: Response, next: NextFunction) => {

  try {
    let userId = req.params.userId
    balances.findOne({userId:userId}, (err: any, user: any) => {
      if (err) {
        return res.json({ message: "fetching error: Invalid User ID provided"});
      }
      if(user) {
        return res
          .status(200)
          .json({ msg: `Account Balance:  ${user.balance}` });
      } else {
        res.json({message:"The User Id is not Correct"})
      }
    });
  } catch (err: any) {
    console.error(err)
  }
})




 
/*******************  GET   Getting all accounts and their balances ****************** */

router.get('/balance', authFunc, async (req: Request, res: Response, next: NextFunction) => {
  try {

      let page = Number(req.params.pageno)
      let size = Number(5)
      if(!page) page = 1
      if(!size) size = 5
      const limit = size
      const skip = ( page - 1 ) * size
    let allUser = await balances.find({}).select({ account_number: true, balance: true, "_id": 0 }).sort("balance").limit(limit).skip(skip);
      if(allUser) {
        return res.status(200).json(allUser);
      } else { 
        res.json({msg:"Record empty"})
      }
  } catch (err: any) {
    console.error(err)
  }
})




/**************** GET all the transaction(Debit And Credit) by the particular user of whose account number is provided **************/

router.get('transaction/:account_number', async(req: Request, res: Response, next: NextFunction) => {
  try {
    let get_user_account_number = req.params.account_number;
    transaction.find({account_number: get_user_account_number }).select({
        receiverAccount: 1,
        amount: 1,
        transferDescription: 1,
        reference: 1,
        createdAt: 1, 
        _id: 0,
      })
      .exec((err: any, userTrans: any) => {
        if(err) { res.json({ message: "error message in user transaction  fetching", }) }
        if(userTrans){
           res.status(200).json(userTrans);
        } else {
          res.json({ message: "User account number provided does not exist" });
        }
      }); 
  } catch (err: any) {
    console.error(err);
  }
} )
 
  
    //  | GET. /transaction/credit/:accountNumber ----->   gets all Debit transactions of a particular user |
 
router.get('/transaction/debit/:account_number', authFunc, async ( req: Request, res: Response, next: NextFunction) => {
  try {
    let user_account_number =await req.params.account_number;
    transaction.find({ senderAccount: user_account_number }).select({
        receiverAccount: 1,
        amount: 1,
        transferDescription: 1,
        reference: 1,
        createdAt: 1,
        _id: 0, 
      })
      .exec((err: any, userTrans: any) => {
        if(err) { 
          return res.json({
            msg: "error message in user transaction  fetching" ,
          }); 
        }
        if(!userTrans) {
         return res.json({ msg: "User account number provided does not exist" }); 
        } else {
          res.status(200).json({msg:"Successful", Status:"Debit", userTrans});
        }
      });  
     // console.log(userAccNo);
      
      
  } catch (err: any) {
    console.error(err);
  }
})

    //  | GET. /transaction/credit/:accountNumber ----->   gets all Credit transactions of a particular user |
 
    router.get('/transaction/credit/:account_number', authFunc, async ( req: Request, res: Response, next: NextFunction) => {

      try {
        let user_account_number = await req.params.account_number;
        transaction.find({ receiverAccount: user_account_number }).select({
          senderAccount: 1,
            amount: 1,
            transferDescription: 1,
            reference: 1,
            createdAt: 1,
            _id: 0, 
          })
          .exec((err: any, userTrans: any) => {
            if(err) { 
              return res.json({
                msg: "error message in user transaction fetching" ,
              });  
            } 
            if(userTrans) {   
              res.status(201).json({msg:"Successful", status:"Credit", userTrans}); 
            } else {
             return res.status(404).json({ msg: "User account number provided does not exist" }); 
             //next()
            }
          });   
          
      } catch (err: any) {
        console.error(err);
      }
    })







// router.post('/deposit', async function(req:Request, res:Response, next:NextFunction) {
//   if (req.body.depositorAccount == "" || req.body.amount == "")
//       return res.status(404).json({ msg: "Empty field.." });
//     if (Number(req.body.amount) < 1 )
//       return res.status(404).json({ msg: "The amount is zero. You cant deposit 0" });
//   const depositorPrevBalance = await balances.findOne({
//     account_number: req.body.depositorAccount,
//   });
//   await balances.updateOne(
//     { account_number: req.body.depositorAccount },
//     { 
//       $set: {balance: Number(depositorPrevBalance.balance) + Number(req.body.amount)},
//       $currentDate: { lastModified: true },
//     } 
//   ); 
//    return res.status(201).json({msg:`#${req.body.amount} deposited succesfully...`})
// })



 

 
module.exports = router; 