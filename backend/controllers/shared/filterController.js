import mongoose from 'mongoose';
import HistoricalPlace from '../../models/historicalPlace.js';

const filterByTag = async (req, res) => {
    try {
        const tags = req.query.tags; // Retrieve the tags from the request query

        if (!tags) {
            // If no tags are provided, return all historical places
            const historicalPlaces = await HistoricalPlace.find(); // Fetch all places
            return res.status(200).json({ message: "Fetched all historical places", historicalPlaces });
        }

        // Convert tags to an array of MongoDB ObjectIds
        const tagIds = Array.isArray(tags)
            ? tags.map(tag => mongoose.Types.ObjectId(tag)) // Convert each tag to ObjectId
            : [mongoose.Types.ObjectId(tags)]; // Single tag case

        // Find historical places where the Tags field contains any of the specified tag IDs
        const historicalPlaces = await HistoricalPlace.find({
            Tags: { $in: tagIds }
        }).populate('Tags'); // Populate to retrieve full tag info if needed

        // Check if any places were found
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found for the given tags.' });
        }

        // Return the filtered results
        return res.status(200).json({ message: "Fetched historical places by tags", historicalPlaces });

    } catch (error) {
        return res.status(500).json({ error: 'Error occurred while filtering historical places by tags.' });
    }
};

export default {
    filterByTag
};
