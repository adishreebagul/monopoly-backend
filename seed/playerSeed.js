import Player from "../models/Player.js";
import mongoose from '../db.js';

const seedPlayers = async () => {
    await Player.deleteMany()
    const players = await Player.insertMany([
        { name: 'Alice', money: 1500, position: 0 },
        { name: 'Bob', money: 1500, position: 0 },
        { name: 'Charlie', money: 1500, position: 0 }
    ])
    console.log('Players created', players.map(p => p._id))
    process.exit()
}

seedPlayers()