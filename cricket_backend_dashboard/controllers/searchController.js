const axios = require('axios');
const Player = require('../model/playerModel');

const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
};

exports.showSearch = (req, res) => {
    res.render('search', {
        players: [],
        searchQuery: '',
        error: null,
        searched: false
    });
};

exports.searchPlayers = async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery?.trim();
        
        // Validation
        if (!searchQuery) {
            return res.render('search', {
                players: [],
                searchQuery: '',
                error: 'Please enter a player name to search',
                searched: false
            });
        }

        if (searchQuery.length < 2) {
            return res.render('search', {
                players: [],
                searchQuery: searchQuery,
                error: 'Please enter at least 2 characters',
                searched: true
            });
        }

        console.log(`Searching for player: ${searchQuery}`);

        const response = await axios.get(`https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search`, {
            headers: headers,
            params: {
                plrN: searchQuery
            }
        });

        let players = [];
        
        if (response.data && response.data.player && Array.isArray(response.data.player)) {
            players = response.data.player;
            
            for (const player of players) {
                await Player.findOneAndUpdate(
                    { playerId: player.id },
                    {
                        playerId: player.id,
                        name: player.name,
                        teamName: player.teamName,
                        faceImageId: player.faceImageId
                    },
                    { upsert: true, new: true }
                );
            }
        }

        console.log(`Found ${players.length} players for search: ${searchQuery}`);

        res.render('search', {
            players: players,
            searchQuery: searchQuery,
            error: players.length === 0 ? 'No players found matching your search' : null,
            searched: true
        });

    } catch (error) {
        console.error('Error searching players:', error);
        
        res.render('search', {
            players: [],
            searchQuery: req.body.searchQuery || '',
            error: 'Failed to search players. Please try again later.',
            searched: true
        });
    }
};