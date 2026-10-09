import { Router } from "express";
import {
  createBook,
  createDocument,
  createIndex,
  createMultipleDocuments,
  updateBook,
  findBookByTitle,
  findBooksByYear,
  findBooksByGenre,
  findBooksSkipLimit,
  findBooksStoredInteger,
  findBooksExcludeGenres,
  deleteBooksBeforeYear,
  findBooksAfterYear,
  findAllBooksAfterYear,
  unwindBookGenres,
  joinBooksAndLogs
} from "./book.service.js";

const bookRouter = Router();

//1. Create an explicit collection named “books” with a validation rule to ensure that each book document has a non-empty title field.
//URL: POST /collection/books

bookRouter.post("/books", async (req, res) => {
  try {
    const result = await createBook(req.body);
    res.status(201).json({ msg: { Ok: 1 }, data: result });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong", err: err.message });
  }
});

//4. Create an index on the books collection for the title field.
//URL: POST /collection/books/index
bookRouter.post("/books/index", async (req, res) => {
  try {
    const result = await createIndex();
    res.status(201).json({ msg: "Index added successfully", data: result });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong", err: err.message });
  }
});

//5. Insert one document into the books collection.
//URL: POST /books
bookRouter.post("/books", async (req, res) => {
  try {
    const result = await createDocument(req.body);
    res.status(201).json({ msg: "Document added successfully", data: result });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong", err: err.message });
  }
});

//6. Insert multiple documents into the books collection with at least three records.
// URL: POST /books/batch
bookRouter.post("/books/batch", async (req, res) => {
  try {
    const result = await createMultipleDocuments(req.body);
    res.status(201).json({ msg: "Documents added successfully", data: result });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong", err: err.message });
  }
});

//8. Update the book with title "Future" change the year to be 2022.
//URL: PATCH/books/Future
bookRouter.patch("/books/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const result = await updateBook(title, req.body);
    res.status(200).json({ msg: "Book updated successfully", data: result });
  } catch (err) {
    res.status(404).json({ message: "Something went wrong", err: err.message });
  }
});

//9. Find a Book with title "Brave New World"
//URL: GET /books/title => /books/title?title=Brave New World
bookRouter.get("/books/title", async (req, res) => {
  try {
    const { title } = req.query;
    const result = await findBookByTitle(title);
    if(!result){
        return res.status(404).json({ msg: "Book not found" });
    }
    res.status(200).json({ msg: "Book found successfully", data: result });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", err: err.message });
  }
});


 //10. Find all books published between 1990 and 2010.
//URL: GET /books/year => /books/year?from=1990&to=2010
bookRouter.get("/books/year",async(req,res)=>{
    try{
        const {from,to} = req.query;
        const result = await findBooksByYear(from,to);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found in the given year range"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //11. Find books where the genre includes "Science Fiction"
//URL: /books/genre?genre=Science Fiction
bookRouter.get("/books/genre",async(req,res)=>{
    try{
        const {genre} = req.query;
        const result = await findBooksByGenre(genre);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found in the given genre"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //12. Skip the first two books, limit the results to the next three, sorted by year in descending order.
//URL: GET /books/skip-limit
bookRouter.get("/books/skip-limit",async(req,res)=>{
    try{
        const result = await findBooksSkipLimit(2,3);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found with the given skip and limit"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //13. Find books where the year field stored as an integer.
//URL: GET /books/year-integer
bookRouter.get("/books/year-integer",async(req,res)=>{
    try{
        const result = await findBooksStoredInteger();
        if(result.length === 0){
            return res.status(404).json({msg:"No books found with year stored as integer"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //14. Find all books where the genres field does not include any of the genres "Horror" or "Science Fiction".
//URL: GET /books/exclude-genres
bookRouter.get("/books/exclude-genres",async(req,res)=>{
    try{
        const { genres } = req.query;
        const result = await findBooksExcludeGenres(genres);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found with the given excluded genres"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //15. Delete all books published before 2000.
// DELETE: GET /books/before-year?year=2000
bookRouter.delete("/books/before-year",async(req,res)=>{
    try{
        const { year } = req.query;
        const result = await deleteBooksBeforeYear(year);
        if(result.deletedCount === 0){
            return res.status(404).json({msg:"No books found with the given year to delete"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //16. Using aggregation Functions, Filter books published after 2000 and sort them by year descending.
//URL: GET /books/aggregate1
bookRouter.get("/books/aggregate1",async(req,res)=>{
    try{

        const result = await findBooksAfterYear(2000);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found after the year 2000"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //17. Using aggregation functions, Find all books published after the year 2000. For each matching book, show only the title, author, and year fields.
//URL: GET /books/aggregate2
bookRouter.get("/books/aggregate2",async(req,res)=>{
    try{
 const result = await findAllBooksAfterYear(2000);
        if(result.length === 0){
            return res.status(404).json({msg:"No books found after the year 2000"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


 //18. Using aggregation functions,break an array of genres into separate documents.
//RL: GET /books/aggregate3
bookRouter.get("/books/aggregate3",async(req,res)=>{
    try{
        const result = await unwindBookGenres();
        if(result.length === 0){
            return res.status(404).json({msg:"No books found"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});


  //19. Using aggregation functions, Join the books collection with the logs collection
//URL: GET /books/aggregate4
bookRouter.get("/books/aggregate4",async(req,res)=>{
    try{
        const result = await joinBooksAndLogs();
        if(result.length === 0){
            return res.status(404).json({msg:"No books found"});
        }
        res.status(200).json({ msg: "Books found successfully", data: result });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong", err: err.message });
    }
});
export default bookRouter;
