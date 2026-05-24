const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("pub"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connectDB = require('./config/db');
connectDB();


app.use('/', require('./routes/cricketRoutes'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});