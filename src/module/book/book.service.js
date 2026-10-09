import { DB } from "../../DB/connection.db.js";

//1
export async function createBook(bookData) {
  const collection = await DB.listCollections({
    name: "books",
  }).toArray();
  if (collection.length === 0) {
    await DB.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title is required and cannot be empty",
            },
          },
        },
      },
    });
  }
  const result = await DB.collection("books").insertOne(bookData);
  return result;
}

//4
export async function createIndex() {
  const result = await DB.collection("books").createIndex({ title: 1 });
  return result;
}

//5
export async function createDocument(bookData) {
  const result = await DB.collection("books").insertOne(bookData);
  return result;
}

//6
export async function createMultipleDocuments(bookData) {
  if (bookData.length < 3) {
    throw new Error("At least three records are required");
  }
  for (const book of bookData) {
    const existingBook = await DB.collection("books").findOne({
      title: book.title,
    });
    if (existingBook) {
      throw new Error(`Book with title "${book.title}" already exists`);
    }
  }
  const result = await DB.collection("books").insertMany(bookData);
  return result;
}

//8
export async function updateBook(title, updateData) {
  const result = await DB.collection("books").updateOne(
    { title: title },
    { $set: updateData },
  );
  return result;
}

//9
export async function findBookByTitle(title) {
  const result = await DB.collection("books").findOne({
    title: title,
  });
  return result;
}

//10
export async function findBooksByYear(from, to) {
  const result = await DB.collection("books")
    .find({
      year: { $gte: Number(from), $lte: Number(to) },
    })
    .toArray();
  return result;
}

//11
export async function findBooksByGenre(genre) {
  const result = await DB.collection("books")
    .find({
      genres: { $regex: genre, $options: "i" },
    })
    .toArray();
  return result;
}


//12
export async function findBooksSkipLimit() {
  const result = await DB.collection("books")
    .find({
      year:{$exists:true},
    })
     .skip(Number(2))
    .limit(Number(3))
    .sort({ year: -1 })
    .toArray();
  return result;
}


//13
export async function findBooksStoredInteger(){
   const result = await DB.collection("books")
    .find({
      year:{$type:"int"},
    })
    .toArray();
  return result;
}


//14
export async function findBooksExcludeGenres(genres) {
  const result = await DB.collection("books")
    .find({
      genres: { $nin: ["Horror", "Science Fiction"] },
    })
    .toArray();
  return result;
}


//15
export async function deleteBooksBeforeYear(year) {
  const result = await DB.collection("books")
    .deleteMany({
      year: { $lt: Number(year) },
    });
  return result;
}

//16
export async function findBooksAfterYear(year) {
  const result = await DB.collection("books")
    .aggregate([
      { $match: { year: { $gt: Number(year) } } },
      { $sort: { year: -1 } }
    ])
    .toArray();
  return result;
}


//17
export async function findAllBooksAfterYear(year) {
  const result = await DB.collection("books")
    .aggregate([
      { $match: { year: { $gt: Number(year) } } },
      { $project: { title: 1, author: 1, year: 1 } }
    ])
    .toArray();
  return result;
}

 
//18
export async function unwindBookGenres() {
  const result = await DB.collection("books")
    .aggregate([
      { $unwind:"$genres" },
    ])
    .toArray();
  return result;
}


//19
export async function joinBooksAndLogs(){
  const result = await DB.collection("books")
    .aggregate([
      { $lookup:{ from: "logs", 
        let: { bookId: { $toString: "$_id" } },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$book_id", "$$bookId"]
            }
          }
        }
      ],
      as: "logs"
    }
  }
    ])
    .toArray();
  return result;
}
 
