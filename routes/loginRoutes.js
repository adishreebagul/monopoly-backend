import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post('/', async (req, res) => {
    try {
        const { name, password } = req.body
        if (!name || !password) return res.status(400).json({ message: 'Name and password required'})

        const existingUser = await User.findOne({ name })
        if (existingUser) return res.status(400).json({ message: 'Username already taken'})

        const hashed = await bcrypt.hash(password, 10)

        const user = await User.create({ name, password: hashed })

        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ user: { id: user._id, name: user.name}, token })
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create player' })
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { name, password } =  req.body
        if(!name || !password) return res.status(400).json({ message: 'Name and password required' })

        const user = await User.findOne({ name })
        if (!user) return res.status(404).json({ message: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({ message: 'Incorrect password' })
        
        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '7d' })

        res.status(201).json({ user: { id: user._id, name: user.name }, token })
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to sign in', error: err.message })
    }
})

export default router