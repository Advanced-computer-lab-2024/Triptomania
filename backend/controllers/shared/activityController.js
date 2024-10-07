import activityModel from '../../models/activity.js'; // Link to advertiser schema
import itineraryModel from '../../models/itinerary.js'; // Import your itinerary model

const viewActivities = async (req, res) => {
  try {
      const bookings = await activityModel.find().sort({ createdAt: -1 }); 
      res.status(200).json(bookings);
  } catch (error) {
      res.status(500).json({ message: "Error fetching activities", error: error.message });
  }
};

const filterActivities = async (req, res) => {
  try {
      const { budget, date, category } = req.query; // Removed ratings

      const filters = {};

      if (budget) filters.price = { $lte: budget }; 
      if (date) filters.date = { $gte: new Date(date) }; 
      if (category) filters.category = category; 

      const filteredActivities = await activityModel.find(filters).sort({ date: 1 }); 

      res.status(200).json(filteredActivities);
  } catch (error) {
      res.status(500).json({ message: "Error filtering activities", error: error.message });
  }
};

const sortActivities = async (req, res) => {
  try {
      const { order, sortBy } = req.query; // Using query instead of body

      // Validate 'order'
      if (!order || (order !== 'high' && order !== 'low')) {
          return res.status(400).json({ message: 'Please provide a valid order value ("high" or "low").' });
      }

      // Validate 'sortBy' for at least price, ratings, or both
      if (!sortBy || (!sortBy.includes('price') && !sortBy.includes('ratings'))) {
          return res.status(400).json({ message: "Invalid sort option. Use 'price', 'ratings', or both." });
      }

      // Determine sort order: -1 for descending (high), 1 for ascending (low)
      const sortOrder = order === 'high' ? -1 : 1;

      // Build dynamic sortOption based on sortBy
      let sortOption = {};
      if (sortBy.includes('price')) {
          sortOption.price = sortOrder; // Add sorting by price
      }
      if (sortBy.includes('ratings')) {
          sortOption.ratings = sortOrder; // Add sorting by ratings
      }

      // Fetch and sort activities
      const activities = await activityModel.find().sort(sortOption);

      // Handle no activities found
      if (activities.length === 0) {
          return res.status(404).json({ message: 'No activities found.' });
      }

      // Return sorted activities
      res.status(200).json(activities);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sorting activities', error: error.message });
  }
};

  

// Itineraries methods

const sortItineraries = async (req, res) => {
  try {
      const { order, sortBy } = req.body;

      // Validate 'order'
      if (!order || (order !== 'high' && order !== 'low')) {
          return res.status(400).json({ message: 'Please provide a valid order value ("high" or "low").' });
      }

      // Validate 'sortBy' for at least price, duration, or both
      if (!sortBy || (!sortBy.includes('price') && !sortBy.includes('duration'))) {
          return res.status(400).json({ message: "Invalid sort option. Use 'price', 'duration', or both." });
      }

      // Determine sort order: -1 for descending (high), 1 for ascending (low)
      const sortOrder = order === 'high' ? -1 : 1;

      // Build dynamic sortOption based on sortBy
      let sortOption = {};
      if (sortBy.includes('price')) {
          sortOption.price = sortOrder; // Add sorting by price
      }
      if (sortBy.includes('duration')) {
          sortOption.duration = sortOrder; // Add sorting by duration
      }

      // Fetch and sort itineraries
      const itineraries = await itineraryModel.find().sort(sortOption);
              // Handle no itineraries found
              if (itineraries.length === 0) {
                return res.status(404).json({ message: 'No itineraries found.' });
            }
    
            // Return sorted itineraries
            res.status(200).json(itineraries);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error sorting itineraries', error: error.message });
        }
    };
    




    const filterItineraries = async (req, res) => {
      try {
          const { budget, date, preferences, language } = req.query;
  
          const filters = {};
  
          // Filter by budget
          if (budget) filters.price = { $lte: budget }; 
          
          // Filter by date (only include itineraries with available dates greater than or equal to the specified date)
          if (date) {
              filters.availableDates = { $gte: new Date(date) };
          } 
          
          // Filter by preferences (assuming preferences is a comma-separated string)
          if (preferences) {
              filters.activities = { $in: preferences.split(',') }; // Adjust based on how preferences are stored
          } 
          
          // Filter by language
          if (language) filters.language = language; 
  
          const filteredItineraries = await itineraryModel.find(filters).sort({ availableDates: 1 }); 
  
          // Handle case where no itineraries are found
          if (filteredItineraries.length === 0) {
              return res.status(404).json({ message: 'No itineraries found matching your criteria.' });
          }
  
          // Return filtered itineraries
          res.status(200).json(filteredItineraries);
      } catch (error) {
          res.status(500).json({ message: "Error filtering itineraries", error: error.message });
      }
  };









  

// const filterItineraries = async (req, res) => {
//    try {
//       const { budget, date, preferences, language } = req.query;

//       const filters = {};

//       if (budget) filters.price = { $lte: budget }; // Filter by budget
//       if (date) filters.date = { $gte: new Date(date) }; // Filter by upcoming date
//       if (preferences) filters.tags = { $in: preferences.split(',') }; // Filter by preferences (e.g. beaches, historic)
//       if (language) filters.language = language; // Filter by language

//       const filteredItineraries = await activityModel.find(filters).sort({ date: 1 }); // Sort by date ascending

//       res.status(200).json(filteredItineraries);
//    } catch (error) {
//       res.status(500).json({ message: "Error filtering itineraries", error: error.message });
//    }
// };



export default{
    filterActivities,
    sortActivities,
    viewActivities,
    sortItineraries,
    filterItineraries
}; 