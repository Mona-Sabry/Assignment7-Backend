import express from "express";
import { PORT } from "./config/config.js";
import { globalErrorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import bookRouter from "./module/book/book.controller.js";
import authorRouter from "./module/author/author.controller.js";
import logRouter from "./module/log/log.controller.js";
import {testConnection} from "./DB/connection.db.js";

async function bootstrap() {
  const app = express();

await testConnection();

  app.use(express.json());

  app.use("/collection", bookRouter);
  app.use("/collection", authorRouter);
  app.use("/collection", logRouter);


  app.all("/{*dummy}", notFoundMiddleware);
  app.use(globalErrorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
