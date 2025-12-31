import express from 'express'
import mongoose from 'mongoose'
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

        if (!game) {
            const properties = await Property.find()
            game = await Game.create({
                players: [],
                board: properties,
                turnIndex: 0,
                status: 'waiting',
            })
        }

        if (game.players.length >= MAX_PLAYERS) return res.status(400).json({ message: 'Game is already full' })

        if (!game.players.some(p => p.toString() === player._id.toString())) {
            game.players.push(player._id)
            player.game = game._id
            await player.save()
        }

        if (game.players.length >= MAX_PLAYERS) game.status = 'started'
        await game.save()

        const populatedGame = await Game.findById(game._id).populate('players')
        res.json(populatedGame)
    } catch (err) {
        res.status(500).json({ message: 'Failed to join game', error: err.message })
    }
})

router.post('/:gameId/rollDice', async (req, res) => {
    const { playerId } = req.body
    const { gameId } = req.params
    try {
        const game = await Game.findById(gameId).populate('players board')
        if (!game) return res.status(404).json({ message: 'Game not found' })

        const currentPlayer = game.players[game.turnIndex]
        const currentPlayerId = currentPlayer._id ? currentPlayer._id : currentPlayer
        if (!mongoose.Types.ObjectId(currentPlayerId).equals(playerId)) {
            return res.status(403).json({ message: "Not your turn" })
        }

        const dice1 = Math.ceil(Math.random() * 6)
        const dice2 = Math.ceil(Math.random() * 6)
        const roll = dice1 + dice2

        const player = game.players.find(p => p._id.toString() === playerId.toString())
        player.position = (player.position + roll) % game.board.length

        game.turnIndex = (game.turnIndex + 1) % game.players.length
        await game.save()

        res.json({ roll, playerPosition: player.position, turnIndex: game.turnIndex })
    } catch (err) {
        res.status(500).json({ message: 'Failed to roll dice', error: err.message })
    }
})

router.post('/:gameId/buyProperty', async (req, res) => {
    const { playerId } = req.body
    const { gameId } = req.params
    try {
        const game = await Game.findById(gameId).populate('players board')
        if (!game) return res.status(404).json({ message: 'Game not found' })

        const currentPlayer = game.players[game.turnIndex]
        const currentPlayerId = currentPlayer._id ? currentPlayer._id : currentPlayer
        if (!mongoose.Types.ObjectId(currentPlayerId).equals(playerId)) {
            return res.status(403).json({ message: "Not your turn" })
        }

        const player = game.players.find(p => p._id.toString() === playerId.toString())
        const property = game.board[player.position]

        if (property.owner) return res.status(400).json({ message: 'Property already owned' })
        if (player.money < property.price) return res.status(400).json({ message: 'Not enough money to buy property' })

        property.owner = player._id
        player.money -= property.price
        player.properties.push(property._id)

        await game.save()
        res.json({ message: 'Property purchased', player, property })
    } catch (err) {
        res.status(500).json({ message: 'Failed to buy property', error: err.message })
    }
})

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players')
        if (!game) return res.status(404).json({ message: 'Game not found' })
        res.json(game)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch game', error: err.message })
    }
})

export default router
