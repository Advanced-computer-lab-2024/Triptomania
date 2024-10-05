import activityModel from '../../models/activity.js'; // Link to advertiser schema



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
      const { budget, date, category, ratings } = req.query;

      const filters = {};


      if (budget) filters.price = { $lte: budget }; 
      if (date) filters.date = { $gte: new Date(date) }; 
      if (category) filters.category = category; 
      if (ratings) filters.ratings = { $gte: ratings }; 

      const filteredActivities = await activityModel.find(filters).sort({ date: 1 }); 

      res.status(200).json(filteredActivities);
   } catch (error) {
      res.status(500).json({ message: "Error filtering activities", error: error.message });
   }
};

const sortActivities = async (req, res) => {
    try {
      const { order, sortBy } = req.body;
  
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
  





export default{
    filterActivities,
    sortActivities,
    viewActivities
}; 