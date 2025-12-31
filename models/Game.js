import mongoose from 'mongoose'
import Player from './Player.js'
import Property from './Property.js'

const gameSchema = new mongoose.Schema({
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    board: [{
        property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
        owner: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null
        }
    }],
    turnIndex: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['waiting', 'started', 'ended'],
        default: 'waiting'
    }

}, { timestamps: true })

const Game = mongoose.model('Game', gameSchema)

export default Game