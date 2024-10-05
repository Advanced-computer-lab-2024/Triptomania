import mongoose from 'mongoose';
import HistoricalPlace from '../../models/historicalPlace.js';
import Tag from '../../models/tag.js';

// Function to add tags to an existing historical place
export const addTagToHistoricalPlace = async (req, res) => {
    try {
        const { id } = req.params; // Historical place ID
        const trimmedId = id.trim(); // Trim whitespace/newline characters
        const { newTagId } = req.body; // Tag ID to be searched

        // Validate ObjectId format
        if (!mongoose.isValidObjectId(trimmedId)) {
            return res.status(400).json({ message: 'Invalid historical place ID' });
        }

        // Find the historical place by its ID
        const historicalPlace = await HistoricalPlace.findById(trimmedId);
        if (!historicalPlace) {
            return res.status(404).json({
                message: 'Historical place not found'
            });
        }

        // Find the tag by its ID
        const tag = await Tag.findById(newTagId);
        if (!tag) {
            return res.status(404).json({
                message: 'Tag not found'
            });
        }
        
        // Add the tag name to the Tags array if it doesn't already exist
        if (!historicalPlace.Tags.includes(tag.name)) {
            historicalPlace.Tags.push(tag.name);  // Add the tag name
            await historicalPlace.save();

            return res.status(200).json({
                message: 'Tag added successfully!',
                data: historicalPlace
            });
        } else {
            return res.status(400).json({
                message: 'Tag already exists'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Error adding tag',
            error: error.message
        });
    }
};
