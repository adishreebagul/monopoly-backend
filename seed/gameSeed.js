import mongoose from '../db.js'
import Game from '../models/Game.js'
import Property from '../models/Property.js'

const createGame = async () => {
    try {
        const properties = await Property.find()

        await Game.deleteMany()

        const game = await Game.create({
            players: [],
            board: properties,
            turnIndex: 0,
            status: 'waiting'
        })

        console.log('Game created successfully:', game._id)
        process.exit(0)
    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

createGame()

