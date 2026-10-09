import {DB} from "../../DB/connection.db.js";

//3
export async function createLog(logData) {
const collection = await DB.listCollections({
    name:"logs"
}).toArray();
if(collection.length === 0){
await DB.createCollection("logs",{
    capped:true,
    size:1048576     //1024*1024 byte
})
}
return await DB.collection('logs').insertOne(logData);
};


//7
export async function createNewLog(logData) {
 const result =  await DB.collection('logs').insertOne(logData);
return result;
};
