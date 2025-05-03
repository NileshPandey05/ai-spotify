import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }]
}, { timestamps: true, collection: "playlists" });

const Playlist = mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);
export default Playlist;
