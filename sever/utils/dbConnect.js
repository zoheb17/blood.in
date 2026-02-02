import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config()

const MONGODB_URI = process.env.DBURI;

async function dbConnect() {
    try {
       await mongoose.connect(MONGODB_URI)
        console.log(`database connected`)
    } catch (error) {
        console.log(error)
    }
}
dbConnect()