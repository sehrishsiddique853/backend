const axios = require('axios');
const Series = require('../model/seriesModel');

const headers = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
};

exports.getSeries = async (req, res) => {
    try {
        const response = await axios.get('https://cricbuzz-cricket.p.rapidapi.com/series/v1/international', {
            headers: headers
        });

        console.log('Series API Response:', response.data);

        let allSeries = [];
        
        if (response.data.seriesMapProto) {
            response.data.seriesMapProto.forEach(monthGroup => {
                if (monthGroup.series && Array.isArray(monthGroup.series)) {
                    monthGroup.series.forEach(series => {
                        allSeries.push({
                            ...series,
                            month: monthGroup.date,
                            seriesType: 'International'
                        });
                    });
                }
            });
        }

        console.log(`Total series found: ${allSeries.length}`);

        for (const series of allSeries) {
            if (series.id) {
                await Series.findOneAndUpdate(
                    { seriesId: series.id },
                    {
                        seriesId: series.id,
                        name: series.name,
                        startDt: series.startDt,
                        endDt: series.endDt,
                        seriesType: 'International',
                        status: 'upcoming' // You can determine this based on dates
                    },
                    { upsert: true, new: true }
                );
            }
        }

        res.render('series', {
            seriesByMonth: response.data.seriesMapProto || [],
            allSeries: allSeries,
            error: null
        });

    } catch (error) {
        console.error('Error fetching series:', error);
        res.render('series', {
            seriesByMonth: [],
            allSeries: [],
            error: 'Failed to load series data. Please try again later.'
        });
    }
};