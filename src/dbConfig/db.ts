import mongoose from "mongoose";

export default async function connect() {
    
    try {
        mongoose.connect(process.env.MONGODB_URL || "")
    } catch (error) {
        
    }
}