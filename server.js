import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import mongoose from './db.js'
import cors from 'cors'
import gameRoutes from './routes/gameRoutes.js'
import loginRoutes from './routes/loginRoutes.js'

dotenv.config()
const app = express()
app.use(express.json())

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}))

// Routes
app.use('/api/auth', loginRoutes)  
app.use('/api/games', gameRoutes)   

// HTTP server
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {

    // Join a specific game room
    socket.on('joinGame', (gameId) => {
        socket.join(gameId)
    })

    // Broadcast a player's move to all clients in the same game
    socket.on('playerMove', (data) => {
        io.to(data.gameId).emit('updateGame', data)
    })

    socket.on('disconnect', () => {
        // Player disconnected
    })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
