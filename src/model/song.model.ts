import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String },
    source: { type: String, enum: ["API", "AI"], required: true },
    prompt: { type: String },
    url: { type: String, required: true },
    duration: { type: Number },
    thumbnail: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true, collection: "songs" });

const Song = mongoose.models.Song || mongoose.model("Song", songSchema);
export default Song;
