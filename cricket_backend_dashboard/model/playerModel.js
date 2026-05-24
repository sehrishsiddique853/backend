const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: { type: String, required: true, unique: true },
    name: String,
    imageId: String,
    battingStyle: String,
    bowlingStyle: String,
    role: String,
    team: String,
    matches: Number,
    runs: Number,
    wickets: Number,
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);