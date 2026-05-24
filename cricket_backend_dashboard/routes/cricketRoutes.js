const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const scoreController = require('../controllers/scoreController');
const seriesController = require('../controllers/seriesController');
const teamsController = require('../controllers/teamsController');
const playersController = require('../controllers/playersController');
const  searchController= require('../controllers/searchController');

router.get('/', homeController.getHomepage);
router.get('/scores', scoreController.getScores);
router.get('/series', seriesController.getSeries);
router.get('/teams', teamsController.getTeams);
router.get('/player/:id', playersController.getPlayer);

router.get('/search', searchController.showSearch);

router.post('/search', searchController.searchPlayers);

module.exports = router;