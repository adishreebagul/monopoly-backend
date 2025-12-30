import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import mongoose from './db.js'
import cors from 'cors'
import playerRoutes from './routes/playerRoutes.js'
import gameRoutes from './routes/gameRoutes.js'

dotenv.config()
const app = express()
app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}))

app.get('/', (req, res) => {
    res.send('Monopoly backend running')
})

app.use('/api/players', playerRoutes)
app.use('/api/games', gameRoutes)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('A player connected', socket.id)

    socket.on('playerMove', (data) => {
        io.emit('updateGame', data)
    })

    socket.on('disconnect', () => {
        console.log('A player disconnected', socket.id)
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
