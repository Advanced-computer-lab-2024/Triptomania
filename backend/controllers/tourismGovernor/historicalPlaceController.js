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

const addHistoricalPlace = async (req, res) => {
    try {
        const { Name, Description, Picture, Location, Opening_hours, Closing_hours, Ticket_prices } = req.body;
        const newHistoricalPlace = new historicalPlaceModel({ Name, Description, Picture, Location, Opening_hours, Closing_hours, Ticket_prices });
        await newHistoricalPlace.save();
        res.status(201).json({
            status: true,
            historicalPlace: newHistoricalPlace
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const editHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Description, Picture, Location, Opening_hours, Closing_hours, Ticket_prices } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Historical place not found'
            });
        }
        const updatedHistoricalPlace = { Name, Description, Picture, Location, Opening_hours, Closing_hours, Ticket_prices, _id: id };
        await historicalPlaceModel.findByIdAndUpdate(id, updatedHistoricalPlace, { new: true });
        res.status(200).json({
            status: true,
            historicalPlace: updatedHistoricalPlace
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

const deleteHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                status: false,
                error: 'Historical place not found'
            });
        }
        await historicalPlaceModel.findByIdAndRemove(id);
        res.status(200).json({
            status: true,
            message: 'Historical place deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        });
    }
}

export default {
    getHistoricalPlaces,
    addHistoricalPlace,
    editHistoricalPlace,
    deleteHistoricalPlace
}