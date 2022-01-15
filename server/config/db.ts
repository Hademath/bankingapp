import mongoose, { ConnectOptions } from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"

let database: mongoose.Connection;
 export const connect = () => {
  // add your own uri below
//   const uri = process.env.MONGO_URI  as string;
const uri ="mongodb+srv://hademathtesting:hademath1992@cluster0.jgljq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  if (database) {
    return;
  }
  mongoose.connect(uri, {
    useNewUrlParser: true
  } as ConnectOptions);

  database = mongoose.connection;
  database.once("open", async () => {
    console.log("You are Connected to database");
  });
   process.setMaxListeners(0)
  database.on("error", () => {
    console.log("Error connecting to database");
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};

export const memoryTestDB = ()=> {
  try {
    MongoMemoryServer.create().then((mongo:MongoMemoryServer) =>{
      const uri = mongo.getUri();
      mongoose.connect(uri).then(()=>{
        console.log("connected to testing DATABASE");
        
      })
    })
 
  } catch (err:any) {
    console.error("could not connect", err.message);
    
  }

}

