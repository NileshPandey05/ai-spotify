import mongoose from "mongoose";
import User from "./user.model";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    artist: {
        type: String,
    },
    source: {
        type: String,
        enum: ["API", "AI"],
        require: true
    },
    prompt: {
        type: String,
    },
    url: {
        type: String,
        require: true,
    },
    duration: {
        type: Number
    },
    thumbnail: { type: String},
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: User}
}, {timestamps: true})

const Song = mongoose.models.songs || mongoose.model("songs", songSchema)

export default Song