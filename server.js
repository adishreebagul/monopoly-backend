import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import './db.js'
import cors from 'cors'
import gameRoutes from './routes/gameRoutes.js'
import loginRoutes from './routes/loginRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use('/api/auth', loginRoutes)
app.use('/api/games', gameRoutes)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

app.set('io', io)

io.on('connection', (socket) => {
  socket.on('joinGame', (gameId) => {
    socket.join(gameId)
  })

  socket.on('playerMove', (data) => {
    io.to(data.gameId).emit('updateGame', data)
  })
})

app.get('/', (req, res) => {
  res.send("Chalu ae be")
})

const PORT = process.env.PORT || 5000
server.listen(PORT)
