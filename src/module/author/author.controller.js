import {Router} from "express";
import { createAuthor } from "./author.sevice.js";

const authorRouter = Router();



//2. Create an implicit collection by inserting data directly into a new collection named
//"authors"
//URL:POST /collection/authors
authorRouter.post("/authors",async (req,res)=>{
    try{
    const result = await createAuthor(req.body);
     res.status(201).json({msg:"Author added successfully", data:result});
    }
    
    catch(err){
       res.status(404).json({message:"Something went wrong",err:err.message});
    }
   
});


export default authorRouter;