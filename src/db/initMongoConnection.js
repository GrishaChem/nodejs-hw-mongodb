import mongoose from "mongoose";

export async function initMongoConnection() {
        await mongoose.connect(process.env.MONGODB_URL);
}