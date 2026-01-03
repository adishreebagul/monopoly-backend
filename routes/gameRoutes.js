import express from 'express'
import Game from '../models/Game.js'
import Property from '../models/Property.js'
import Player from '../models/Player.js'
import User from '../models/User.js'
import BoardTile from '../models/BoardTile.js'

const router = express.Router()
const MAX_PLAYERS = 4

router.post('/joinRandom', async (req, res) => {
    const { userId } = req.body;
    const io = req.app.get('io');

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let game = await Game.findOne({
            status: 'waiting',
            $expr: { $lt: [{ $size: "$players" }, MAX_PLAYERS] }
        });

        if (!game) {
            const boardTiles = await BoardTile.find().sort({ index: 1 });
            game = await Game.create({
                players: [],
                board: boardTiles.map(tile => ({ property: tile.property || null, owner: null })),
                turnIndex: 0,
                status: 'waiting'
            });
        }

        const existingPlayer = await Player.findOne({ user: user._id, game: game._id });
        if (existingPlayer) return res.status(400).json({ message: 'User already joined this game' });

        const player = await Player.create({
            user: user._id,
            game: game._id,
            money: 1500,
            position: 0,
            properties: [],
            inJail: false
        });

        game.players.push(player._id);
        if (game.players.length >= MAX_PLAYERS) game.status = 'started';
        await game.save();

        const populatedGame = await Game.findById(game._id)
        .populate({
            path: 'players',
            populate: { path: 'user', select: 'name' }
        })
        .populate({
            path: 'board.property'
        })

        // Emit to all players in this game room
        io.to(game._id.toString()).emit('playerJoined', populatedGame);

        res.json(populatedGame);

    } 
    catch (err) {
        res.status(500).json({ message: 'Failed to join game', error: err.message });
    }
});

router.post('/:gameId/rollDice', async (req, res) => {
    const { playerId } = req.body
    const { gameId } = req.params
    try {
        const game = await Game.findById(gameId).populate('players board')
        if (!game) return res.status(404).json({ message: 'Game not found' })

        const currentPlayerId = game.players[game.turnIndex].toString()
        if (currentPlayerId !== playerId) return res.status(403).json({ message: 'Not your turn' })

        const player = await Player.findById(playerId)
        if (!player || player.game.toString() !== gameId) return res.status(403).json({ message: 'Player not in this game' })

        const roll = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6)
        player.position = (player.position + roll) % game.board.length
        await player.save()

        res.json({ roll, playerPosition: player.position, turnIndex: game.turnIndex })
    } catch (err) {
        res.status(500).json({ message: 'Failed to roll dice', error: err.message })
    }
})

router.post('/:gameId/buyProperty', async (req, res) => {
    const { playerId } = req.body
    const { gameId } = req.params
    try {
        const game = await Game.findById(gameId).populate('board.property players')
        if (!game) return res.status(404).json({ message: 'Game not found' })

        const currentPlayerId = game.players[game.turnIndex].toString()
        if (currentPlayerId !== playerId) return res.status(403).json({ message: 'Not your turn' })

        const player = await Player.findById(playerId)
        if (!player || player.game.toString() !== gameId) return res.status(403).json({ message: 'Player not in this game' })

        const tile = game.board[player.position]
        if (tile.owner) return res.status(400).json({ message: 'Property already owned' })
        if (player.money < tile.property.price) return res.status(400).json({ message: 'Not enough money to buy property' })

        tile.owner = player._id
        player.money -= tile.property.price
        player.properties.push(tile.property._id)
        game.turnIndex = (game.turnIndex + 1) % game.players.length

        await player.save()
        await game.save()

        res.json({ message: 'Property purchased', player, tile })
    } catch (err) {
        res.status(500).json({ message: 'Failed to buy property', error: err.message })
    }
})

router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId)
      .populate({
        path: 'players',
        populate: { path: 'user', select: 'name' }
      })
      .populate({
        path: 'board.property'
      })

    if (!game) return res.status(404).json({ message: 'Game not found' })
    res.json(game)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch game', error: err.message })
  }
})


export default router
