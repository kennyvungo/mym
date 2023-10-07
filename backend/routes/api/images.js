const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const nasaKey = process.env.NASA_API_KEY;
    router.get('/', async function(req,res){
            try {
                response = await axios.get('https://api.nasa.gov/planetary/apod', {
                    params: {
                    api_key: nasaKey
                },
                });
                let apoddata = response.data;
                res.json(apoddata);
            } catch (error) {
                res.status(500).json({ error: 'An error occurred while fetching data from the NASA API.' });
            }
    });

module.exports = router;