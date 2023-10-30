import express, { Application } from "express";
import { dbConfig } from "./config/dbConnect";
import { myApp } from "./appConnect";
import { environment } from "./config/envConfig";

const port: number = parseInt(environment.PORT);
const app: Application = express();
myApp(app);

const server = app.listen(environment.PORT || port, () => {
  dbConfig();
});

process.on("uncaughtException", (error: Error) => {
  console.log(`uncaughtException: `, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("unhandledRejection: ", reason);
  server.close(() => {
    process.exit(1);
  });
});
