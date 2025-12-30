import express from 'express'
import Game from '../models/Game.js'

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

export default router