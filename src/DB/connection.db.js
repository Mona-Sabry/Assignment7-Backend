import {MongoClient} from "mongodb";
import {DB_NAME, DB_URL} from "../config/config.js";

const client = new MongoClient(DB_URL);

export async function testConnection(){
    try{
        await client.connect();
        console.log("DB connected");
        
    }
    catch(error){
        console.log("DB connection failed");
        console.log(error);
        
    }
}

export const DB = client.db(DB_NAME);