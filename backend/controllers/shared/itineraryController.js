import mongoose from 'mongoose';
import itineraryModel from '../../models/itinerary.js';

const getItineraries = async (req, res) => { 
  try {
    const id = req.user._id;

    // Retrieve itineraries based on `isActivated` and `bookingMade`
    const itineraries = await itineraryModel.find({
      isFlagged: false,
      $or: [
        { isActivated: true },               // Public itineraries
        { bookingMade: { $in: [id] } }        // Private itineraries where `bookingMade` contains `id`
      ]
    });

    res.status(200).json({
      status: true,
      itineraries: itineraries
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

const viewItineraries = async (req, res) => { 
  try {
    // Retrieve itineraries based on `isActivated` and `bookingMade`
    const itineraries = await itineraryModel.find({
    });

    res.status(200).json({
      status: true,
      itineraries: itineraries
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};


const getItinerary = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        error: 'Itinerary not found'
      });
    }
    const itinerary = await itineraryModel.findById(id);
    if (!itinerary) {
      return res.status(404).json({
        status: false,
        error: 'Itinerary not found'
      });
    }
    res.status(200).json({
      status: true,
      data: itinerary
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};

const addItinerary = async (req, res) => {
  try {
    let { Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff,  Start_date, End_date, Tags, creatorId, preferenceTags } = req.body;

    // // Check that parameters are not empty
    // if (!Name || !activities || !locationsToVisit || !timeLine || !duration || !language || !price || !availableDates || !availableTimes || !pickUp || !dropOff || !bookingMade || !creatorId) {
    //   return res.status(400).json({ message: "All required fields must be provided." });
    // }

    // Check that parameters' type is right
    // if(typeof Name !== 'string')
    //     {
    //         console.log(Name);
    //         return res.status(400).json({ message: "Name must be a string"});
    //     }
    // if (Array.isArray(locationsToVisit) && locationsToVisit.every(item => typeof item === 'string'))
    // {
    //     return res.status(400).json({ message: "Locations must be an array of strings"});
    // }
    // if(typeof timeLine !== 'string')
    // {
    //     return res.status(400).json({ message: "Time line must be a string"});
    // }
    // if(typeof duration !== 'string')
    // {
    //     return res.status(400).json({ message: "Duration line must be a string"});
    // }
    // if(typeof language !== 'string')
    // {
    //     return res.status(400).json({ message: "Lnaguage line must be a string"});
    // }
    // if(typeof price !== 'Number')
    // {
    //     return res.status(400).json({ message: "Price line must be a Number"});
    // }
    // if (Array.isArray(activities) && activities.every(item => typeof item === 'string'))
    //     {
    //         return res.status(400).json({ message: "Activities must be a string"});
    //     }
    // if (Array.isArray(availableDates) && availableDates.every(item => typeof item === 'string'))
    // {
    //     return res.status(400).json({ message: "Available dates must be a string"});
    // }
    // if (Array.isArray(availableTimes) && availableTimes.every(item => typeof item === 'string'))
    // {
    //     return res.status(400).json({ message: "Available times must be a string"});
    // }
    // if (Array.isArray(accesibility) && accesibility.every(item => typeof item === 'string'))
    // {
    //     return res.status(400).json({ message: "Accesibility times must be a string"});
    // }
    // if(typeof pickUp !== 'string')
    // {
    //     return res.status(400).json({ message: "Pick up must be a string"});
    // }
    // if(typeof dropOff !== 'string')
    // {
    //     return res.status(400).json({ message: "Drop off must be a string"});
    // }
    if (!preferenceTags) {
      preferenceTags = [];
    }
    const newItinerary = new itineraryModel({ Name, activities, locationsToVisit, timeLine, duration, language, price, availableDates, availableTimes, accesibility, pickUp, dropOff, Start_date, End_date, Tags, creatorId, preferenceTags });
    await newItinerary.save();
    res.status(201).json({
      status: true,
      itinerary: newItinerary
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
}

const editItinerary = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        error: 'Itinerary not found'
      });
    }

    // Dynamically build the update object with only the provided fields
    const updateFields = {};
    const fieldsToUpdate = [
      'Name', 'activities', 'locationsToVisit', 'timeLine', 'duration',
      'language', 'price', 'availableDates', 'availableTimes', 'accesibility',
      'pickUp', 'dropOff', 'bookingMade', 'Start_date', 'End_date', 'Tags'
    ];

    // Iterate over each field and add to the updateFields if present in req.body
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // If no valid fields were provided, return an error response
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: false,
        error: 'No fields provided for update'
      });
    }

    // Perform the update
    const updatedItinerary = await itineraryModel.findByIdAndUpdate(id, updateFields, { new: true });

    // If itinerary is not found
    if (!updatedItinerary) {
      return res.status(404).json({
        status: false,
        error: 'Itinerary not found'
      });
    }

    // Return the updated document
    res.status(200).json({
      status: true,
      data: updatedItinerary
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};


const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        status: false,
        error: 'Itinerary not found'
      });
    }
    const itineraryBooked = await itineraryModel.findById(id).select('bookingMade');

    // Checks if itinerary is booked
    if (itineraryBooked.bookingMade.length !== 0) {
      return res.status(400).json({ message: "Itinerary already booked, can not delete" });
    } else {
      await itineraryModel.findByIdAndDelete(id);
      res.status(200).json({
        status: true,
        message: 'Itinerary deleted successfully'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
}

const getMyItineraries = async (req, res) => {
  const creatorId = req.user._id;

  try {
      const itineraries = await itineraryModel.find({ creatorId: creatorId });

      if (!itineraries || itineraries.length === 0) {
          return res.status(404).json({
              status: false,
              error: 'No itineraries found for the provided creatorId.'
          });
      }

      res.status(200).json({
          status: true,
          itineraries: itineraries
      });
  } catch (err) {
      res.status(500).json({
          status: false,
          error: err.message
      });
  }
};

const sortItineraries = async (req, res) => {
  try {
      const { order, sortBy } = req.query;

      // Validate 'order'
      if (!order || (order !== 'high' && order !== 'low')) {
          return res.status(400).json({ message: 'Please provide a valid order value ("high" or "low").' });
      }

      // Validate 'sortBy' for at least price, duration, or both
      if (!sortBy || (!sortBy.includes('price') && !sortBy.includes('ratings'))) {
          return res.status(400).json({ message: "Invalid sort option. Use 'price', 'duration', or both." });
      }

      // Determine sort order: -1 for descending (high), 1 for ascending (low)
      const sortOrder = order === 'high' ? -1 : 1;

      // Build dynamic sortOption based on sortBy
      let sortOption = {};
      if (sortBy.includes('price')) {
          sortOption.price = sortOrder; // Add sorting by price
      }
      if (sortBy.includes('ratings')) {
          sortOption.ratings = sortOrder; // Add sorting by duration
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
              // Convert the date string to a Date object for comparison
              const parsedDate = new Date(date);
              filters.availableDates = { $gte: parsedDate }; // Match itineraries with available dates on or after the specified date
          } 
          
          // Filter by preferences (assuming preferences is a comma-separated string of ObjectIds)
          if (preferences) {
              const preferenceArray = preferences.split(',').map(id => mongoose.Types.ObjectId(id.trim())); // Convert string to ObjectIds
              filters.preferenceTags = { $in: preferenceArray }; // Match itineraries with any of the specified preference tags
          } 
          
          // Filter by language
          if (language) filters.language = language; 
  
          // Fetch the filtered itineraries
          const filteredItineraries = await itineraryModel.find(filters).sort({ availableDates: 1 }); 
  
          // Handle case where no itineraries are found
          if (filteredItineraries.length === 0) {
              return res.status(404).json({ message: 'No itineraries found matching your criteria.' });
          }
  
          // Return filtered itineraries
          res.status(200).json(filteredItineraries);
      } catch (error) {
          console.error(error); // Log the error for debugging purposes
          res.status(500).json({ message: "Error filtering itineraries", error: error.message });
      }
  };

export default
  {
    getItinerary,
    addItinerary,
    editItinerary,
    deleteItinerary,
    getItineraries,
    getMyItineraries,
    sortItineraries,
    filterItineraries,
    viewItineraries
  }