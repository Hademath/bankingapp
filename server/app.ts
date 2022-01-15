import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connect, memoryTestDB} from './config/db';
import logger from 'morgan';
import cors from 'cors';
import mongoose from "mongoose"
require('dotenv').config();
/** some testing */
import { MongoMemoryServer } from 'mongodb-memory-server';
const jwt =  require("jsonwebtoken")



import session from 'express-session';
import e from 'express';
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv/config');


const MongoStore = require('connect-mongodb-session')(session);
//const passport = require('passport');
//const exphbs = require('express-handlebars');
//const multer = require('multer')

//dotenv.config({ path: './config.env' });

require('events').EventEmitter.defaultMaxListeners = 15;
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const accountsRouter = require('./routes/accounts');



///////////////////////
// const methodOverride = require('method-override');
// import authRoute from './routes/auth';
////////////

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', accountsRouter)

/////////////////////////////////////////////////////////////
const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection:'essions',
    mongooseConnection: mongoose.connection
})
//express middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,  
    store: store
    //  MongoStore({mongoUrl: process.env.MONGODB_URI })
// Don't create a session until something is stored 
// cookie: { secure: true } - this wont work without https
}))

//////////////////////////////////////////////////////


//app.use(passport.initialize());
//app.use(passport.session());

app.use(function (req: any, res:Response, next:NextFunction) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
//app.use('/auth', authRoute);

app.use(morgan('dev'));
// catch 404 and forward to error handler
app.use(function (req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function ( err: any,req: Request, res: Response, next: NextFunction) {
  // render the error page
  res.status(err.status || 500);
  res.send(err);
}); 
const PORT = process.env.PORT; 
//connect();
if(process.env.NODE_ENV === 'test'){
   memoryTestDB() 
}
else{
  connect() 
}

app.listen(PORT, () => console.log(`My Server is running on port ${PORT}`));

export default app;