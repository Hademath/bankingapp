"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryTestDB = exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let database;
const connect = () => {
    // add your own uri below
    //   const uri = process.env.MONGO_URI  as string;
    const uri = "mongodb+srv://hademathtesting:hademath1992@cluster0.jgljq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    if (database) {
        return;
    }
    mongoose_1.default.connect(uri, {
        useNewUrlParser: true
    });
    database = mongoose_1.default.connection;
    database.once("open", async () => {
        console.log("You are Connected to database");
    });
    process.setMaxListeners(0);
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};
exports.connect = connect;
const disconnect = () => {
    if (!database) {
        return;
    }
    mongoose_1.default.disconnect();
};
exports.disconnect = disconnect;
const memoryTestDB = () => {
    try {
        mongodb_memory_server_1.MongoMemoryServer.create().then((mongo) => {
            const uri = mongo.getUri();
            mongoose_1.default.connect(uri).then(() => {
                console.log("connected to testing DATABASE");
            });
        });
    }
    catch (err) {
        console.error("could not connect", err.message);
    }
};
exports.memoryTestDB = memoryTestDB;
