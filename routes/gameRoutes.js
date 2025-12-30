import express from 'express'
import Game from '../models/Game.js'
import Property from '../models/Property.js'

const router = express.Router()

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players')

        if (!game) {
            return res.status(404).json({ message: 'Game not found' })
        }

        res.json(game)
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch game' })
    }
})

router.post('/joinRandom', async (req, res) => {
    const { playerId } = req.body

    try {
        const player = await Player.findById(playerId)
        if (!player) return res.status(404).json({ message: 'Player not found' })

        let game = await Game.findOne({ status: 'waiting', 'player.3': { $exists: false } })

        if (!game) {
            const properties = await Property.find()
            game = await Game.create({
                players: [],
                board: properties,
                turnIndex: 0,
                status: 'waiting',
            })
        }

        if (!game.players.includes(player._id)) {
            game.players.push(player._id)
            await game.save()
        }
        res.json(game)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to join game' })
    }
})

export default router