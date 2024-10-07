import HistoricalPlace from '../../models/historicalPlace.js'; // Adjusted to match naming convention

// Filter historical places/museums by tag
export const filterByTag = async (req, res) => {
    try {
        const tag = req.query.tag; // Get the tag from the request query
        console.log('Filter tag:', tag); // Log the filter tag

        if (!tag) {
            // If no tag is provided, return all historical places
            const historicalPlaces = await HistoricalPlace.find(); // Fetch all places
            return res.status(200).json({ message: "Fetched all historical places", historicalPlaces });
        }

        // Find historical places that match the tag
        const historicalPlaces = await HistoricalPlace.find({
            Tags: { $regex: tag, $options: 'i' } // Case-insensitive search
        });

        // Check if any places were found
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found for the given tag.' });
        }

        // Return the filtered results
        return res.status(200).json({ message: "Fetched historical places by tag", historicalPlaces });

    } catch (error) {
        console.error('Error in filterByTag function:', error); // Log the error
        return res.status(500).json({ error: 'Error occurred while filtering historical places by tag.' });
    }
};
export default{
    filterByTag
}