import mongoose from 'mongoose';
import activityCategoryModel from '../../models/activityCategory.js';
import activityModel from '../../models/activity.js'; // Link to advertiser schema


const addCategory = async (req, res) => {
    try {
        const { categoryName, categoryDescription } = req.body;

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        if (typeof categoryName !== 'string') {
            return res.status(400).json({ message: "CategoryName must be a string." });
        }

        if (typeof categoryDescription !== 'string') {
            return res.status(400).json({ message: "CategoryDescription must be a string." });
        }

        const newActivityCategory = new activityCategoryModel({
            CategoryName: categoryName,
            CategoryDescription: categoryDescription
        });

        await newActivityCategory.save();

        res.status(201).json({ message: "Activity Category added successfully", activityCategory: newActivityCategory });
    } catch (error) {
        res.status(500).json({ message: "Error adding activity category", error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await activityCategoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activity categories", error: error.message });
    }
};

const editCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoryName, categoryDescription } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format." });
        }

        if (!categoryName && !categoryDescription) {
            return res.status(400).json({ message: "At least one field must be provided for update." });
        }

        const updatedCategory = await activityCategoryModel.findOneAndUpdate(
            { _id: id },
            { CategoryName: categoryName, CategoryDescription: categoryDescription },
            { new: true }
        );

        res.status(200).json({ message: "Activity Category updated successfully", activityCategory: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating activity category", error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID format." });
        }

        await activityCategoryModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Activity Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting activity category", error: error.message });
    }
}

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




export default {
    addCategory,
    getCategories,
    editCategory,
    deleteCategory,
    filterActivities,
    sortActivities,
   filterItineraries,
    viewActivities,
    sortItineraries
}
