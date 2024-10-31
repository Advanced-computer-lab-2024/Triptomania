import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';
import HistoricalPlace from '../../models/historicalPlace.js';

// Fetch all upcoming activities, itineraries, and historical places/museums
export const viewUpcoming = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00) to include all of today

        // Find all activities with a date today or in the future
        const upcomingActivities = await Activity.find({
            date: { $gte: startOfToday }
        });

        // Find all itineraries with a date today or in the future
        const upcomingItineraries = await Itinerary.find({
            date: { $gte: startOfToday }
        });

        // Fetch all historical places/museums (no date constraints)
        const historicalPlaces = await HistoricalPlace.find();

        // Return the results in a combined response
        res.status(200).json({
            upcomingActivities,
            upcomingItineraries,
            historicalPlaces
        });

    } catch (error) {
        res.status(500).json({ error: 'Error occurred while fetching upcoming data' });
    }
};

export default {
    viewUpcoming
};
