const axios = require('axios');
const Match = require('../model/matchModel');

const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
};

exports.getScores = async (req, res) => {
    try {
        const [liveResponse, recentResponse] = await Promise.all([
            axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live', {
                headers: headers
            }),
            axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent', {
                headers: headers
            })
        ]);

        let liveMatches = [];
        if (liveResponse.data.typeMatches) {
            liveResponse.data.typeMatches.forEach(typeMatch => {
                if (typeMatch.seriesMatches) {
                    typeMatch.seriesMatches.forEach(seriesMatch => {
                        if (seriesMatch.seriesAdWrapper) {
                            if (seriesMatch.seriesAdWrapper.matches && Array.isArray(seriesMatch.seriesAdWrapper.matches)) {
                                liveMatches = liveMatches.concat(seriesMatch.seriesAdWrapper.matches);
                            }
                        } else if (seriesMatch.matches && Array.isArray(seriesMatch.matches)) {
                            liveMatches = liveMatches.concat(seriesMatch.matches);
                        }
                    });
                }
            });
        }

        let allRecentMatches = [];
        if (recentResponse.data.typeMatches) {
            recentResponse.data.typeMatches.forEach(typeMatch => {
                if (typeMatch.seriesMatches) {
                    typeMatch.seriesMatches.forEach(seriesMatch => {
                        if (seriesMatch.seriesAdWrapper) {
                            if (seriesMatch.seriesAdWrapper.matches && Array.isArray(seriesMatch.seriesAdWrapper.matches)) {
                                allRecentMatches = allRecentMatches.concat(seriesMatch.seriesAdWrapper.matches);
                            }
                        } else if (seriesMatch.matches && Array.isArray(seriesMatch.matches)) {
                            allRecentMatches = allRecentMatches.concat(seriesMatch.matches);
                        }
                    });
                }
            });
        }

        const completedMatches = allRecentMatches.filter(match => 
            match.matchInfo && match.matchInfo.state === 'Complete'
        ).slice(0, 10);

        res.render('scores', { 
            liveMatches: liveMatches,
            recentMatches: completedMatches,
            error: null
        });
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.render('scores', { 
            liveMatches: [], 
            recentMatches: [],
            error: 'Failed to load scores. Please try again later.'
        });
    }
};