import express, { NextFunction, Request, Response } from 'express';
const bcrypt = require('bcrypt');
const router = express.Router();
import User from '../models/User';
import {validateUser, validateUserLogin} from '../utilis/usersValidation';
const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';
 require('dotenv/config');
 require('dotenv').config();
//const config = require('./../config/config').get(process.env.NODE_ENV);


/* ***************  Register new users ********************** */
router.post('/signup', async  function(req:Request, res:Response, next:NextFunction) {

  try {
    const {error}  = validateUser(req.body);
    if(error) return res.status(400).json({ error: error.details[0].message })
    User.findOne({email:req.body.email}, (err:any,user:any)=>{
      if(err) return res.json("No user error...")
          if(!user){
         User.findOne({phone_number:req.body.phone_number}, async (err:any, phone_number:any) =>{
          if(!phone_number){
            const salt = await bcrypt.genSalt(10)
            const newUser = new User({
              firstName:req.body.firstName,
              lastName: req.body.lastName,
              email:req.body.email.toLowerCase(),
              DOB: req.body.DOB,
              phone_number: req.body.phone_number,
              password: await bcrypt.hash(req.body.password, salt), 
              confirmPass:"password"
            })
            const result = await newUser.save()
            console.log(result); 
            res.status(200).json(result);
            message:"Success! You have succesfully Created an Account"
            
          }else{ 
          res.json("Phone Number already exist");
          }

         }) 
            }else{
              res.json("Email already exist"); 
              // console.log("User already exist");
               
            }
      })
    }catch(err){ 
      res.json("something went wrong");
    }
})


/* ***************  Login user ********************** */
router.post("/login", async (req, res) => {
try {
  
  const { error } = validateUserLogin(req.body);  // validate the user
  if (error) return res.status(400).json({ error:   error.details[0].message }); // throw validation errors
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Email you provided is not correct" });  // log errors if email is incorrect
  
  // check if password provided match what we have in database 
  const validPassword = await bcrypt.compare(req.body.password, user.password); 
  if (!validPassword){

    return res.status(400).json({ error: "Password is incorrect" });
  }else{
       // create token
    const token = jwt.sign(
      // payload data
      { firstName: user.name, id: user._id, }, process.env.TOKEN_SECRET, 
      //{expiresIn:1 * 24 * 60 * 60} 
      );
   // console.log(token);
    
    // res.header("auth-token", token).json({   
    //   error: null,
    //   data: {
    //     token,
    //   },
    //   message:"You have successfully login"
    // }); 

    //save the jwt token in cookies to as an access to the protected routes   
        res.cookie("jwt_token", token, { httpOnly: true });
        return res.status(200).json(
             {
              message:"You have successfully login",
            // token: token,
           });    
         
  }
    
 
} catch (error) {
  console.log(error);
  
}

  }); 



  /***************************** LOG OUT USER BY CLEARING THE COKIES ********************************/ 
  router.get('/logout',function(req:any,res:Response){
    res.cookie('jwt_token', '',  {expires: new Date(1), path: '/' });
    res.clearCookie('jwt_token');
    //res.redirect('/');
    return res.status(200).json("You have Successfully Logged Out ")
});





/* ***************  Login user  storing in cokies ********************** */  
//  router.post('/login',  (req: Request, res: Response) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   if (!email || !password.length) {
//       res.status(404).json("empty empty fields")
//       return;
//   }
//   User.findOne({ email: req.body.email }, async (err: any, user: any) => {
//       if (err) {
//         return  res.status(404).json(err) 
//       }
//       if (!user) {
//           return res.status(403).json("user does not exist");
//       }
//       //validate the password
//       let validPass = await bcrypt.compare(req.body.password, user.password);
//       if (!validPass) {
//           return res.status(404).json({ msg: "password or email incorrect" });
//       } else {
//         //save the jwt token
//         const maxAge = 1 * 24 * 60 * 60;
//         const access_token = jwt.sign({ email:email }, process.env.TOKEN_SECRET,
//           {
//             expiresIn: maxAge,
//           }
//         );
//         res.cookie("jwt", access_token, { httpOnly: true });
//         return res.status(200).json(
//           {
//             msg: "login successfully done",
//             isLogin: true, 
//             fullName: user.fullName,
//             //token:access_token,
//           });
//       }
//   });
// }
// )
  

module.exports = router;
