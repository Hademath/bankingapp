// import express, { NextFunction, Request as any, Response } from 'express';
// //import { Secret ,verify } from 'jsonwebtoken';

import { Request, Response, NextFunction } from "express";
const jwt  = require("jsonwebtoken")

export const authFunc =  (req:Request,res:Response,next:NextFunction)=>{
    const token  = req.cookies.jwt_token;
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err:any,data:any)=>{
            if(err){
                return res.json("error occurred...")
            }
            if(token){
                next() 
            }
        })
    }else{
        res.json("Error, No token Provided, Login to access this route")
    }
}

















// module.exports = {
//     ensureAuth: function (req:any, res:Response,next:NextFunction) {
//       if (req.isAuthenticated()) {
//         return next()
//       } else {
//         res.redirect('/')
//       }
//     },
//     ensureGuest: function (req:any, res: Response, next: NextFunction) {
//       if (!req.isAuthenticated()) {
//         return next();
//       } else {
//         res.redirect('/dashboard');
//       }
//     },
//      auth:function(req:any, res: Response, next: NextFunction) {
//       const accessToken = req.cookies.accessToken;
//       if (!accessToken) {
//         return res.redirect('/users/login');
//       }
//       // Based on 'Bearer ksfljrewori384328289398432'
//       try {
//         verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret);
//         return next();
//       } catch (error) {
//         // console.log('auth error', error);
//         res.redirect('/users/login');
//       }
//     }
//   }


