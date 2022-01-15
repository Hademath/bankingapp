"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const morgan_2 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const jwt = require("jsonwebtoken");
const express_session_1 = __importDefault(require("express-session"));
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv/config');
const MongoStore = require('connect-mongodb-session')(express_session_1.default);
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
const app = (0, express_1.default)();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_2.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', accountsRouter);
/////////////////////////////////////////////////////////////
const store = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: 'essions',
    mongooseConnection: mongoose_1.default.connection
});
//express middleware 
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
    //  MongoStore({mongoUrl: process.env.MONGODB_URI })
    // Don't create a session until something is stored 
    // cookie: { secure: true } - this wont work without https
}));
//////////////////////////////////////////////////////
//app.use(passport.initialize());
//app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});
app.use('/', indexRouter);
//app.use('/auth', authRoute);
app.use((0, morgan_1.default)('dev'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.send(err);
});
const PORT = process.env.PORT;
//connect();
if (process.env.NODE_ENV === 'test') {
    (0, db_1.memoryTestDB)();
}
else {
    (0, db_1.connect)();
}
app.listen(PORT, () => console.log(`My Server is running on port ${PORT}`));
exports.default = app;
