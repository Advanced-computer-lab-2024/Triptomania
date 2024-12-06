import Place from '../../models/historicalPlace.js';
import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';
import PreferenceTag from '../../models/preferenceTag.js';
import Tag from '../../models/tag.js';

export const search = async (req, res) => {
    try {
        const query = req.body?.query?.trim(); // search term

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const matchedTags = await Tag.find({ name: { $regex: query, $options: 'i' } });

        const matchedPreferenceTags = await PreferenceTag.find({ PreferenceTagName: { $regex: query, $options: 'i' } });

        const tagIds = matchedTags.map(tag => tag._id);
        const preferenceTagIds = matchedPreferenceTags.map(tag => tag._id);

        const places = await Place.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { Category: { $regex: query, $options: 'i' } },
                { Tags: { $in: tagIds } } // Filter by matching Tag IDs
            ]
        })//.populate('Tags'); // Ensure Tags are populated

        const activities = await Activity.find({
            $or: [
              { name: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for name
              { description: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for description
              { location: { $regex: new RegExp(query, 'i') } } // Case-insensitive search for location
            ]
          });

        const itineraries = await Itinerary.find({
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { preferenceTags: { $in: preferenceTagIds } } // Filter by matching PreferenceTag IDs
            ]
        })//.populate('preferenceTags'); // Ensure preferenceTags are populated

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
        res.status(500).json({ error: 'Error occurred while searching' });
    }
};

export default {
    search
};
