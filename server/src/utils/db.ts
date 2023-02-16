import mongoose from "mongoose";
import { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER } from "../config";

mongoose.set("strictQuery", true);

const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("connected to mongo-db");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
