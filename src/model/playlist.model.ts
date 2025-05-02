import mongoose from "mongoose";
import User from "./user.model";
import Song from "./song.model";

const PlaylistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    description: { type: String},
    songId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Song
        }
    ]
}, {timestamps: true})

const Playlist = mongoose.models.playlists || mongoose.model("playlists", PlaylistSchema)

export default Playlist