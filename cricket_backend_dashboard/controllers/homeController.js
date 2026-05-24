const axios = require('axios');
const Match = require('../model/matchModel');

exports.getHomepage = async (req, res) => {
    try {
        console.log('Starting API call...');
        console.log('API Key exists:', !!process.env.RAPIDAPI_KEY);
        
        const headers = {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        };

        console.log('Headers:', headers);

        const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/matches/v1/recent', {
            headers: headers,
            timeout: 10000
        });

        console.log('API Response Status:', response.status);
        console.log('API Response Data Type:', typeof response.data);
        
    
        if (!response.data) {
            throw new Error('No data received from API');
        }

      
        let allMatches = [];
        
        if (response.data.typeMatches) {
            response.data.typeMatches.forEach(typeMatch => {
                if (typeMatch.seriesMatches) {
                    typeMatch.seriesMatches.forEach(seriesMatch => {
                        if (seriesMatch.seriesAdWrapper) {
                            if (seriesMatch.seriesAdWrapper.matches && Array.isArray(seriesMatch.seriesAdWrapper.matches)) {
                                allMatches = allMatches.concat(seriesMatch.seriesAdWrapper.matches);
                            }
                        } else if (seriesMatch.matches && Array.isArray(seriesMatch.matches)) {
                            allMatches = allMatches.concat(seriesMatch.matches);
                        }
                    });
                }
            });
        }

        console.log(`Total matches found: ${allMatches.length}`);

   
        const completedMatches = allMatches.filter(match => 
            match.matchInfo && match.matchInfo.state === 'Complete'
        );

        console.log(`Completed matches: ${completedMatches.length}`);

     
        res.render('home', { 
            matches: completedMatches,
            error: null
        });

    } catch (error) {
        console.error('Detailed Error:', error);
        console.error('Error response:', error.response?.data);
    
        res.render('home', { 
            matches: [],
            error: 'Failed to load recent matches. Please try again later.'
        });
    }
};