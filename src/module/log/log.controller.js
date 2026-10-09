import {Router} from "express";
import { createNewLog } from "./log.service.js";

const logRouter = Router();



// //3. Create a capped collection named "logs" with a size limit of 1MB. 
//URL:POST /collection/logs/capped
logRouter.post("/logs/capped",async (req,res)=>{
    try{
    const result = await createLog(req.body);
     res.status(201).json({msg:{"Ok": 1}, data:result});
    }
    
    catch(err){
       res.status(404).json({message:"Something went wrong",err:err.message});
    }
   
});

 //7. Insert a new log into the logs collection.
//URL: POST /logs
logRouter.post("/logs",async (req,res)=>{
    try{
    const result = await createNewLog(req.body);
     res.status(201).json({msg:"Index added successfully", data:result});
    }
    
    catch(err){

       res.status(404).json({message:"Something went wrong",err:err.message});
    }
   
});





export default logRouter;