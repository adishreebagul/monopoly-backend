import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    money: { type: Number, default: 1500 },
    position: { type: Number, default: 0 },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    inJail: { type: Boolean, default: false },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', default: null }
})

const Player = mongoose.model('Player', playerSchema)

export default Player