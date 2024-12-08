import mongoose from 'mongoose';
import HistoricalPlace from '../../models/historicalPlace.js';
import Tag from '../../models/tag.js';

// Function to add tags to an existing historical place
const addTagToHistoricalPlace = async (req, res) => {
    try {
        const { id, newTagId } = req.body; // Tag ID to be searched

        // Validate ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid historical place ID' });
        }

        // Find the historical place by its ID
        const historicalPlace = await HistoricalPlace.findById(id);
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
// Function to add a new tag
const addTag = async (req, res) => {
    try {
        const { name } = req.body;

        // Check that the name is provided
        if (!name) {
            return res.status(400).json({ message: 'Tag name is required.' });
        }

        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists.' });
        }

        // Create a new tag
        const newTag = new Tag({ name });
        await newTag.save();

        res.status(201).json({
            status: true,
            message: 'Tag added successfully!',
            tag: newTag
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error adding tag',
            error: err.message
        });
    }
};
// Function to get all tags or a specific tag
const getTags = async (req, res) => {
    try {
        // Fetch all tags
        const tags = await Tag.find();
        res.status(200).json({ status: true, tags });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error retrieving tags',
            error: err.message
        });
    }
};
// Function to update an existing tag
const updateTag = async (req, res) => {
    try {
        const { id, name } = req.body;

        // Check that the name is provided
        if (!name) {
            return res.status(400).json({ message: 'Tag name is required.' });
        }

        // Find the tag by its ID
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Update the tag name
        tag.name = name;
        await tag.save();

        res.status(200).json({
            status: true,
            message: 'Tag updated successfully!',
            tag
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error updating tag',
            error: err.message
        });
    }
};
// Function to delete a tag
const deleteTag = async (req, res) => {
    try {
        const { id } = req.body;

        // Find the tag by its ID
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        await Tag.findByIdAndDelete(id);
        res.status(200).json({
            status: true,
            message: 'Tag deleted successfully!'
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error deleting tag',
            error: err.message // Send the error message to the client
        });
    }
};

export default {
    addTagToHistoricalPlace,
    addTag,
    getTags,
    deleteTag,
    updateTag
}