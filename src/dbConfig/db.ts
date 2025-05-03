import mongoose, { connection } from "mongoose";

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || "")
        const connection = mongoose.connection

        // console.log("connection", connection)

        connection.on('connected', () => {
            console.log('MongoDB connected successfully')
        })

        connection.on('error', (err) => {
            console.log('MongoDb Connection error, Please make sure MongoDB is Running '+ err)
            process.exit()
        })
    } catch (error) {
        console.log("Something goes wrong")
        console.log(error)
    }
}