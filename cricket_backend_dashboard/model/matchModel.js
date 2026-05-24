const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamId: Number,
    teamName: String,
    teamSName: String,
    imageId: Number
});

const venueSchema = new mongoose.Schema({
    id: Number,
    ground: String,
    city: String,
    timezone: String,
    latitude: String,
    longitude: String
});

const inningsSchema = new mongoose.Schema({
    inningsId: Number,
    runs: Number,
    wickets: Number,
    overs: Number
});

const teamScoreSchema = new mongoose.Schema({
    inngs1: inningsSchema,
    inngs2: inningsSchema
});

const matchInfoSchema = new mongoose.Schema({
    matchId: { type: Number, required: true, unique: true },
    seriesId: Number,
    seriesName: String,
    matchDesc: String,
    matchFormat: String,
    startDate: String,
    endDate: String,
    state: String,
    status: String,
    team1: teamSchema,
    team2: teamSchema,
    venueInfo: venueSchema,
    currBatTeamId: Number,
    seriesStartDt: String,
    seriesEndDt: String,
    isTimeAnnounced: Boolean,
    stateTitle: String
});

const matchSchema = new mongoose.Schema({
    matchInfo: matchInfoSchema,
    matchScore: {
        team1Score: teamScoreSchema,
        team2Score: teamScoreSchema
    }
});

module.exports = mongoose.model('Match', matchSchema);