const Player = require('../model/playerModel');
const axios = require('axios');

const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
};

exports.getPlayer = async (req, res) => {
    try {
        const playerId = req.params.id;
        
        const response = await axios.get(`https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${playerId}`, {
            headers: headers
        });

        const playerData = response.data;

        await Player.findOneAndUpdate(
            { playerId: playerId },
            {
                playerId: playerId,
                name: playerData.name,
                nickName: playerData.nickName,
                battingStyle: playerData.bat,
                bowlingStyle: playerData.bowl,
                role: playerData.role,
                height: playerData.height,
                birthPlace: playerData.birthPlace,
                teams: playerData.teams,
                DoB: playerData.DoB,
                DoBFormat: playerData.DoBFormat,
                intlTeam: playerData.intlTeam,
                image: playerData.image,
                faceImageId: playerData.faceImageId,
                bio: playerData.bio,
                rankings: playerData.rankings
            },
            { upsert: true, new: true }
        );

        res.render('player', {
            player: playerData,
            error: null
        });

    } catch (error) {
        console.error('Error fetching player details:', error);
        
        try {
            const playerFromDB = await Player.findOne({ playerId: req.params.id });
            if (playerFromDB) {
                res.render('player', {
                    player: playerFromDB,
                    error: 'Limited information available'
                });
            } else {
                throw new Error('Player not found');
            }
        } catch (dbError) {
            res.render('player', {
                player: null,
                error: 'Player not found or failed to load player details.'
            });
        }
    }
};