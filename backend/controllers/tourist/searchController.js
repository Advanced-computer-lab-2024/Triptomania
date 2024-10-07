import Place from '../../models/historicalPlace.js';
import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';

// Search for museums, activities, or itineraries by name, category, or tag
export const search = async (req, res) => {
    try {
        const { query } = req.body; // search term
        console.log('Search query:', query); // Log the search query

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Search by name, category, or tag in places
        const places = await Place.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { Category: { $regex: query, $options: 'i' } },
                { Tags: { $in: [new RegExp(query, 'i')] } }
            ]
        });

        console.log('Places found:', places.length);

        // Search by name, category, or tag in activities
        const activities = await Activity.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },    // Search by name, case-insensitive
                { category: { $regex: query, $options: 'i' } }, // Search by category
                // Since tags is a string, we use a simple regex to search within the string
                { tags: { $regex: new RegExp(query, 'i') } }   // Search within tags string
            ]
        });

        console.log('Activities found:', activities.length);
        console.log('Activities:', activities);  // Log the actual activities to see the data

        // Search by name, category, or tag in itineraries
        const itineraries = await Itinerary.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },     // Search by itinerary name
                { Tags: { $in: [new RegExp(query, 'i')] } }     // Search within tags
            ]
        });

        console.log('Itineraries found:', itineraries.length);

        // Prepare the response
        const results = {
            places,
            activities,
            itineraries
        };

        // Check if all results are empty
        const isEmpty = Object.values(results).every(array => array.length === 0);

        if (isEmpty) {
            return res.status(404).json({ message: 'No search results found for your query.' });
        }

        // Return the results
        res.status(200).json(results);

    } catch (error) {
        console.error('Error in search function:', error); // Log the error
        res.status(500).json({ error: 'Error occurred while searching' });
    }
};

export default {
    search
};
