import express from 'express'
import Game from '../models/Game.js'
import Property from '../models/Property.js'
import Player from '../models/Player.js'

const router = express.Router()
const MAX_PLAYERS = 4

router.post('/joinRandom', async (req, res) => {
    const { playerId } = req.body

    try {
        const player = await Player.findById(playerId)
        if (!player) return res.status(404).json({ message: 'Player not found' })

        let game = await Game.findOne({
            status: 'waiting',
            $expr: { $lt: [{ $size: "$players" }, MAX_PLAYERS] }
        })

        // If no waiting game exists, create one
        if (!game) {
            const properties = await Property.find()
            game = await Game.create({
                players: [],
                board: properties,
                turnIndex: 0,
                status: 'waiting',
            })
        }

        // Safety check: do not exceed MAX_PLAYERS
        if (game.players.length >= MAX_PLAYERS) {
            return res.status(400).json({ message: 'Game is already full' })
        }

        if (!game.players.includes(player._id)) {
            game.players.push(player._id)

            player.game = game._id
            await player.save()
        }

        if (game.players.length >= MAX_PLAYERS) {
            game.status = 'started'
        }

        await game.save()

        // Populate players before sending to frontend
        const populatedGame = await Game.findById(game._id).populate('players')
        res.json(populatedGame)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Failed to join game' })
    }
})

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

export default router
