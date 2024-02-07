import mongoose from "mongoose";
import Redis from "ioredis";

export const connectToDb = () =>
    mongoose
        .connect(process.env.DB_URL!!)
        .then(() => console.log("Connected to database."))
        .catch(() => console.log("Failed to connect to database."));

export const redis = Redis.createClient();
