const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    seriesId: { type: Number, required: true, unique: true },
    name: String,
    startDt: String,
    endDt: String,
    seriesType: String,
    matchFormat: String,
    status: String, // 'upcoming', 'ongoing', 'completed'
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Series', seriesSchema);