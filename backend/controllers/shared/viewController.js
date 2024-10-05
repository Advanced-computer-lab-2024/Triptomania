import Activity from '../../models/activity.js';
import Itinerary from '../../models/itinerary.js';
import HistoricalPlace from '../../models/historicalPlace.js';

// Fetch all upcoming activities, itineraries, and historical places/museums
export const viewUpcoming = async (req, res) => {
    try {
        const currentDate = new Date(); // Get the current date

        // Find all upcoming activities with a future date
        const upcomingActivities = await Activity.find({
            date: { $gte: currentDate }
        });

        // Find all upcoming itineraries with a future date
        const upcomingItineraries = await Itinerary.find({
            date: { $gte: currentDate }
        });

        // Fetch all historical places/museums (no date constraints)
        const HistoricalPlaces = await HistoricalPlace.find();

        // Return the results in a combined response
        res.status(200).json({
            upcomingActivities,
            upcomingItineraries,
            HistoricalPlaces
        });

    } catch (error) {
        res.status(500).json({ error: 'Error occurred while fetching upcoming data' });
    }
};
