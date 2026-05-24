const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: String,
    name: String,
    imageId: String,
    battingStyle: String,
    bowlingStyle: String,
    role: String,
    team: String
});

const teamSchema = new mongoose.Schema({
    teamId: Number,
    teamName: String,
    teamSName: String,
    imageId: String,
    players: [playerSchema],
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);