import mongoose from "mongoose";
import dotenv from 'dotenv'

const mongoURI = process.env.MONGO_URI

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error'))

export default mongoose