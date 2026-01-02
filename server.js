import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from './db.js';
import cors from 'cors';
import gameRoutes from './routes/gameRoutes.js';
import loginRoutes from './routes/loginRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET','POST']
}));

// Routes
app.use('/api/auth', loginRoutes);
app.use('/api/games', gameRoutes);

// HTTP server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET','POST'] }
});

// Attach io to app so routes can use it
app.set('io', io);

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Socket ${socket.id} joined game ${gameId}`);
    });

    socket.on('playerMove', (data) => {
        io.to(data.gameId).emit('updateGame', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
