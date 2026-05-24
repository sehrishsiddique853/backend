const axios = require('axios');
const Team = require('../model/teamModel');
const Player = require('../model/playerModel');

const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
};


exports.getTeams = async (req, res) => {
    try {
        const worldCupTeams = [2, 3, 4, 5, 11, 7]; // India, Pakistan, Australia, England, South Africa, New Zealand
        
        let teamsData = [];

        for (const teamId of worldCupTeams) {
            try {
                const response = await axios.get(`https://cricbuzz-cricket.p.rapidapi.com/teams/v1/${teamId}/players`, {
                    headers: headers
                });

                if (response.data && response.data.player) {
                    const teamInfo = response.data.player[0]; // First item has team info
                    const players = response.data.player.slice(1); // Rest are players
                    
                    const teamData = {
                        teamId: teamId,
                        teamName: this.getTeamName(teamId),
                        teamSName: this.getTeamShortName(teamId),
                        players: players.map(player => ({
                            playerId: player.id,
                            name: player.name,
                            imageId: player.imageId,
                            battingStyle: player.battingStyle || 'Not specified',
                            bowlingStyle: player.bowlingStyle || 'Not specified',
                            role: this.getPlayerRole(player.name, players),
                            team: this.getTeamName(teamId)
                        }))
                    };

                    teamsData.push(teamData);

                    // Store in MongoDB
                    await Team.findOneAndUpdate(
                        { teamId: teamId },
                        teamData,
                        { upsert: true, new: true }
                    );

                    // Store players individually
                    for (const player of players) {
                        if (player.id && player.name) {
                            await Player.findOneAndUpdate(
                                { playerId: player.id },
                                {
                                    playerId: player.id,
                                    name: player.name,
                                    imageId: player.imageId,
                                    battingStyle: player.battingStyle || 'Not specified',
                                    bowlingStyle: player.bowlingStyle || 'Not specified',
                                    role: this.getPlayerRole(player.name, players),
                                    team: this.getTeamName(teamId)
                                },
                                { upsert: true, new: true }
                            );
                        }
                    }
                }
            } catch (error) {
                console.error(`Error fetching team ${teamId}:`, error.message);
            }
        }

        res.render('teams', {
            teams: teamsData,
            error: teamsData.length > 0 ? null : 'Failed to load teams data'
        });

    } catch (error) {
        console.error('Error in getTeams:', error);
        res.render('teams', {
            teams: [],
            error: 'Failed to load teams data. Please try again later.'
        });
    }
};


exports.getTeamName = (teamId) => {
    const teamNames = {
        2: 'India',
        3: 'Pakistan', 
        4: 'Australia',
        5: 'England',
        11: 'South Africa',
        7: 'New Zealand'
    };
    return teamNames[teamId] || 'Unknown Team';
};

exports.getTeamShortName = (teamId) => {
    const shortNames = {
        2: 'IND',
        3: 'PAK',
        4: 'AUS', 
        5: 'ENG',
        11: 'RSA',
        7: 'NZ'
    };
    return shortNames[teamId] || 'UNK';
};

exports.getPlayerRole = (playerName, allPlayers) => {
   
    const bowlers = ['Bumrah', 'Shami', 'Starc', 'Cummins', 'Afridi', 'Rabada'];
    const allRounders = ['Pandya', 'Jadeja', 'Stokes', 'Shakib'];
    
    if (bowlers.some(bowler => playerName.includes(bowler))) return 'Bowler';
    if (allRounders.some(ar => playerName.includes(ar))) return 'All-rounder';
    return 'Batsman';
};