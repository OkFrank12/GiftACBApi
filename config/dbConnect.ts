import mongoose from "mongoose";
import { environment } from "./envConfig";

const connectURL: string = environment.MONGO_CONNECT;

export const dbConfig = () => {
  mongoose.connect(connectURL).then(() => {
    console.log(`${mongoose.connection.host} is ready to serve`);
  });
};
