import mongoose from 'mongoose';
import historicalPlaceModel from '../../models/historicalPlace.js';

const getHistoricalPlaces = async (req, res) => {
    try {
        const historicalPlaces = historicalPlaceModel.find();
        res.status(200).json({
            status: true,
            historicalPlaces: historicalPlaces
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
}

export default {
    getHistoricalPlaces
}