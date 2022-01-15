"use strict";
// import express, { NextFunction, Request as any, Response } from 'express';
// //import { Secret ,verify } from 'jsonwebtoken';
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFunc = void 0;
const jwt = require("jsonwebtoken");
const authFunc = (req, res, next) => {
    const token = req.cookies.jwt_token;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.json("error occurred...");
            }
            if (token) {
                next();
            }
        });
    }
    else {
        res.json("Error, No token Provided, Login to access this route");
    }
};
exports.authFunc = authFunc;
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
