import Player from "../models/Player.js";
import mongoose from '../db.js';

const addPlayer = async () => {
    const player = await Player.create({
        name: 'Lee',
        money: 1500,
        position: 0
    });
    console.log('Player created:', player._id);
    process.exit();
}

addPlayer();
