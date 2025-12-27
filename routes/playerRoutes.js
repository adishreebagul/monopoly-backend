import express from 'express'
import Player from '../models/Player.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { name } = req.body

        const player = await Player.create({ name })

        res.status(201).json(player)
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create player' })
    }
})

export default router