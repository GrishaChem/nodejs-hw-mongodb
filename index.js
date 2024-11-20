import { initMongoConnection } from "./db/initMongoConnection.js";
import { setUpServer } from "./src/server.js";
import dotenv from 'dotenv';
dotenv.config();


const bootStrap = async () => {
    try{
        await initMongoConnection()
        
        setUpServer()
}
   catch(error) {
        console.error(error)
        throw error
    }
}

bootStrap()