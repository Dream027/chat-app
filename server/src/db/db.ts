import mongoose from "mongoose";

async function connectToDb() {
    try {
        await mongoose.connect(process.env.DATABASE_URL!!);
        console.log("Connected to database.");
    } catch (e) {
        console.log("Failed to connect to database.");
        console.log(e);
    }
}

export default connectToDb;
