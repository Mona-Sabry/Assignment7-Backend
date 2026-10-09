import {DB} from "../../DB/connection.db.js";

//2
export async function createAuthor(authorData) {
const result =  await DB.collection('authors').insertOne(authorData);
return result;
};