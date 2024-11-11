import Place from '../../models/historicalPlace.js';
import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';
import PreferenceTag from '../../models/preferenceTag.js';
import Tag from '../../models/tag.js';

export const search = async (req, res) => {
    try {
        const query = req.body?.query?.trim(); // search term
        console.log('Search query:', query);

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Step 1: Find matching tags and preference tags by name
        console.log('Searching for matching tags...');
        const matchedTags = await Tag.find({ name: { $regex: query, $options: 'i' } });
        console.log('Matched tags:', matchedTags);

        const matchedPreferenceTags = await PreferenceTag.find({ PreferenceTagName: { $regex: query, $options: 'i' } });
        console.log('Matched preference tags:', matchedPreferenceTags);

        const tagIds = matchedTags.map(tag => tag._id);
        const preferenceTagIds = matchedPreferenceTags.map(tag => tag._id);

        // Step 2: Search places by Name, Category, or matching Tag IDs
        console.log('Searching for places...');
        const places = await Place.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { Category: { $regex: query, $options: 'i' } },
                { Tags: { $in: tagIds } } // Filter by matching Tag IDs
            ]
        })//.populate('Tags'); // Ensure Tags are populated

        console.log('Places found:', places.length);

        // Step 3: Search activities by name, category, or matching Preference Tag IDs
        console.log('Searching for activities...');
        const activities = await Activity.find({
            $or: [
              { name: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for name
              { description: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for description
              { location: { $regex: new RegExp(query, 'i') } } // Case-insensitive search for location
            ]
          });

        console.log('Activities found:', activities.length);

        // Step 4: Search itineraries by Name or matching Preference Tag IDs
        console.log('Searching for itineraries...');
        const itineraries = await Itinerary.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { preferenceTags: { $in: preferenceTagIds } } // Filter by matching PreferenceTag IDs
            ]
        })//.populate('preferenceTags'); // Ensure preferenceTags are populated

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
        console.error('Error in search function:', error);
        res.status(500).json({ error: 'Error occurred while searching' });
    }
};

export default {
    search
};
