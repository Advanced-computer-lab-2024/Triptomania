
import historicalPlace from '../../models/historicalPlace.js'; // Import the HistoricalPlace model


// Search function for HistoricalPlace by Name
const searchHistoricalPlaceByName = async (req, res) => {
  const searchCriteria = req.query.query; // Get search term from query params

  try {
    // Query for HistoricalPlace by Name
    const searchQuery = {
      Name: { $regex: searchCriteria, $options: 'i' } // Case-insensitive search
    };

    // Execute the query
    const historicalPlacesResults = await historicalPlace.find(searchQuery).exec();

    // Respond with the results
    if (historicalPlacesResults.length > 0) {
      res.status(200).json({ historicalPlaces: historicalPlacesResults });
    } else {
      res.status(404).json({ message: 'No historical places found matching the search criteria.' });
    }

  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: 'An error occurred during the search' });
  }
};

export {
  searchHistoricalPlaceByName
};




