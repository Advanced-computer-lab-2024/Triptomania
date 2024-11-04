// Import userModel and other modules using ES module syntax
import userModel from '../../models/tourist.js';
import Itinerary from '../../models/itinerary.js'; // Adjust the path as necessary
import tourguide from '../../models/tourGuide.js'; // Adjust the path as necessary
import activityModel from '../../models/activity.js';
import itineraryModel from '../../models/itinerary.js';

import mongoose from 'mongoose';
import crypto from 'crypto';

import activityCategoryModel from '../../models/activityCategory.js';

// Create a new tourist
const CreateTourist = async (req, res) => {
  const { username, email, password, mobile, nationality, DOB, job_Student/*, wallet*/ } = req.body;
  //const hashed = hashPassword(Password);
  
  try {
    // Check for existing user by username or email
    const existingTourist = await userModel.findOne({
      $or: [{ username }, { email }]
    });

    if (existingTourist) {
      // Return an error if the user already exists
      return res.status(400).send({ message: 'Username or email already exists.' });
    }

    // Check age requirement
    const dobDate = new Date(DOB);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    const monthDiff = new Date().getMonth() - dobDate.getMonth();
    const isUnderage = age < 18 || (age === 18 && monthDiff < 0);

    // Create a new tourist
    const tourist = await userModel.create({ username, email, password, mobile, nationality, DOB, job_Student, underage: isUnderage });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/////////////////////////////////////////////////////////////////////

// Get all tourists
const getTourist = async (req, res) => {
  try {
    const tourist = await userModel.find();
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

// Get one tourist

const getOneTourist = async (req, res) => {
  try {
   // const {  username, email, password, mobile, nationality,job_Student } = req.body;
    const tourist = await userModel.find({username});
    return res.status(200).send(tourist);
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////


// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const { username, email, password, mobile, nationality, job_Student, wallet, points } = req.body;
    console.log('Request Body:', req.body); // Log the incoming request

    // Fetch the existing tourist data
    const existingTourist = await userModel.findOne({ username });
    if (!existingTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      email: email !== undefined ? email : existingTourist.email,
      password: password !== undefined ? password : existingTourist.password,
      mobile: mobile !== undefined ? mobile : existingTourist.mobile,
      nationality: nationality !== undefined ? nationality : existingTourist.nationality,
      job_Student: job_Student !== undefined ? job_Student : existingTourist.job_Student,
      wallet: wallet !== undefined ? wallet : existingTourist.wallet,
      points: points !== undefined ? points : existingTourist.points
    };

    // Remove undefined fields (optional as we've handled undefined values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    console.log('Update Data:', updateData); // Log what's going to be updated

    // Check if the email already exists but exclude the current user
    if (email && email !== existingTourist.email) {
      const existingTouristEmail = await userModel.findOne({ email, username: { $ne: username } });
      if (existingTouristEmail) {
        return res.status(400).send({ message: 'Email already exists.' });
      }
      updateData.email = email;
    }

    const updatedTourist = await userModel.findOneAndUpdate({ username }, updateData, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Updated Tourist:', updatedTourist); // Log the updated document
    res.status(200).json(updatedTourist);
  } catch (error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
};

const redeemPoints = async (req, res) => {

    try{
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid ID format' });
        }

        const tourist = await userModel.findOne({ _id: id });

    if (!tourist) {
      return res.status(404).send({ message: 'Tourist not found' });
    }

    if (tourist.points % 5000 !== 0 || tourist.points < 5000 ) {
      return res.status(400).json({ message: "Points must be a multiple of 5000 to redeem." });
    }

        const pointsToRedeem = tourist.points * 0.01;
        tourist.wallet += pointsToRedeem;
    
    const redeemed = await userModel.findOneAndUpdate(
      { _id: id },
      { wallet: tourist.wallet, points: 0 },
      { new: true }
  );

  res.status(200).json({ message: "wallet updated successfully" });
} catch (error) {
  res.status(500).json({ message: "Error updating wallet", error: error.message });
}
};
const addComment = async (req, res) => {
  const { id, type } = req.body; // Get activityId and comment from the request body
  
  try {
    // Check if ID exists
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format." });
   }

   let addedComment;

  // Add comment depending on the type
  switch(type) 
  {
    case "activity":
      addedComment = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the activity was found and updated
      if (!addedComment) {
        return res.status(404).json({ error: 'Activity not found' });
      }
  
      res.status(200).json(addedComment); // Send the updated activity with the new comment
    case "tourGuide":
      addedComment = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the tour guide was found and updated
      if (!addedComment) {
        return res.status(404).json({ error: 'Tour guide not found' });
      }
  
      res.status(200).json(addedComment); // Send the updated itinerary with the new comment
    case "itinerary":
      addedComment = await Activity.findByIdAndUpdate(
        activityId,
        { $push: { comments: comment } },
        { new: true } // Return the updated document
      );
  
      // Check if the itinerary was found and updated
      if (!addedComment) {
        return res.status(404).json({ error: 'Tour guide not found' });
      }
  
      res.status(200).json(addedComment); // Send the updated itinerary with the new comment
  }
  } catch(error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
}


// Add review to a product
const reviewProduct = async (req, res) => {
  const { productId, review } = req.body; // Get productId and reviews from the request body
  
  try {
    // Find the product by ID and add the review to the Reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { Reviews: review } },
      { new: true } // Return the updated document
    );

    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct); // Send the updated product with the new review
  } catch (error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(400).json({ error: error.message });
  }
};

/////////////////////////////////////////////////////////////////
export const rateTourGuide = async (req, res) => {
  const { itineraryId, rating } = req.body; // Get itineraryId and rating from request body
  const touristId = req.params.touristId; // Get touristId from URL parameters

  try {
      // Verify if the tourist exists
      const tourist = await userModel.findById(touristId);
      if (!tourist) return res.status(404).json({ error: 'Tourist not found' });

      // Find the itinerary
      const itinerary = await itineraryModel.findById(itineraryId);
      if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

      // Check if the tourist completed the itinerary by checking bookingMade
      if (!itinerary.bookingMade.includes(touristId)) {
          return res.status(403).json({ error: 'You have not completed this itinerary' });
      }

      // Check if the itinerary has ended by comparing the end date with the current date
      const currentDate = new Date();
      const [day, month, year] = itinerary.End_date.split('/'); // Assuming format is DD/MM/YYYY
      const endDate = new Date(year, month - 1, day); // JavaScript months are 0-indexed

      if (endDate > currentDate) {
          return res.status(403).json({ error: 'This itinerary has not ended yet; you cannot rate it' });
      }

      // Find the tour guide associated with the itinerary
      const tourGuide = await tourguide.findById(itinerary.creatorId);
      if (!tourGuide) return res.status(404).json({ error: 'Tour guide not found' });

      // Check if the tourist has already rated this tour guide for the specific itinerary
      const existingRatingIndex = tourGuide.ratings.findIndex(r => r.touristId.toString() === touristId);

      if (existingRatingIndex !== -1) {
          // If the tourist has already rated, return a message
          return res.status(400).json({ error: 'You have already rated this tour guide for this itinerary' });
      }

      // Add a new rating
      tourGuide.ratings.push({ touristId, rating });

      // Calculate new average rating
      const totalRatings = tourGuide.ratings.length;
      const sumRatings = tourGuide.ratings.reduce((sum, rate) => sum + rate.rating, 0);
      tourGuide.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0; // Prevent division by zero

      // Save the updated tour guide
      await tourguide.findByIdAndUpdate(itinerary.creatorId, { ratings: tourGuide.ratings, averageRating: tourGuide.averageRating }, { new: true });

      res.status(200).json({ message: 'Rating submitted successfully', averageRating: tourGuide.averageRating });
  } catch (error) {
      console.error("Error in rateTourGuide:", error); // Log the error for debugging
      res.status(500).json({ error: 'Server error', details: error.message });
  }
};





const chooseCategory = async (req, res) => { //frontend will be list of categories once tourist click on 
                                             // specific category all details of it appears
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid category ID format." });
    }


    const category = await activityCategoryModel.findById(id);

    if (!category) {
        return res.status(404).json({ message: "Category not found." });
    }

   
    res.status(200).json({ message: "Category details retrieved successfully", categoryDetails: category });
} catch (error) {
    res.status(500).json({ message: "Error retrieving category details", error: error.message });
}

};


// Method for booking an activity
const bookActivity = async (req, res) => {
  const { activityId } = req.params; 
  const { _id } = req.body; 

  try {
    // Check if the activity exists
    const activity = await activityModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found.' });
    }

    // Check if the tourist exists
    const tourist = await userModel.findById(_id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Check if the tourist's wallet has enough funds
    if (tourist.wallet < activity.price) {
      return res.status(400).json({ message: 'Insufficient funds in wallet.' });
    }

    // Proceed with booking
    activity.bookingMade.push(_id); // Add the touristId to the activity's bookingMade array
    tourist.wallet -= activity.price; // Deduct the price from the tourist's wallet

    // Save the updated activity and tourist objects
    await activity.save(); // Save the updated activity with the new booking
    await tourist.save(); // Save the updated tourist's wallet

    res.status(200).json({ message: 'Activity booked successfully!', activity });
  } catch (error) {
    console.error('Error booking activity:', error);
    res.status(500).json({ message: 'Error booking activity', error: error.message });
  }
};



const bookItinerary = async (req, res) => {
  const { itineraryId } = req.params; 
  const { _id } = req.body; 

  try {
    // Check if the activity exists
    const itinerary = await itineraryModel.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found.' });
    }

    // Check if the tourist exists
    const tourist = await userModel.findById(_id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Check if the tourist's wallet has enough funds
    if (tourist.wallet < itinerary.price) {
      return res.status(400).json({ message: 'Insufficient funds in wallet.' });
    }

    // Proceed with booking
    itinerary.bookingMade.push(_id); 
    tourist.wallet -= itinerary.price; // Deduct the price from the tourist's wallet

    // Save the updated activity and tourist objects
    await itinerary.save(); // Save the updated activity with the new booking
    await tourist.save(); // Save the updated tourist's wallet

    res.status(200).json({ message: 'Itinerary booked successfully!', itinerary });
  } catch (error) {
    console.error('Error booking activity:', error);
    res.status(500).json({ message: 'Error booking itinerary', error: error.message });
  }
};

//////////////////////////////////////////////////////////////////////
export const rateItinerary = async (req, res) => {
  const { itineraryId, rating } = req.body;
  const touristId = req.params.touristId;

  try {
      // Verify if the tourist (user) exists
      const user = await userModel.findById(touristId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Find the itinerary
      const itinerary = await itineraryModel.findById(itineraryId);
      if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });

      // Check if the itinerary has ended by comparing the end date with the current date
      const currentDate = new Date();
      const [day, month, year] = itinerary.End_date.split('/'); // Assuming format is DD/MM/YYYY
      const endDate = new Date(year, month - 1, day); // JavaScript months are 0-indexed

      if (endDate > currentDate) {
          return res.status(403).json({ message: 'This itinerary has not ended yet; you cannot rate it' });
      }

      // Check if the user has already rated this itinerary
      if (itinerary.ratings && itinerary.ratings.some(r => r.touristId.equals(touristId))) {
          return res.status(400).json({ message: 'You have already rated this itinerary' });
      }

      // Add the user's rating to the itinerary's ratings array
      itinerary.ratings.push({ touristId, rating });

      // Calculate new average rating
      const totalRatings = itinerary.ratings.length;
      const sumRatings = itinerary.ratings.reduce((sum, rate) => sum + rate.rating, 0);
      itinerary.averageRating = sumRatings / totalRatings;

      await itinerary.save();

      res.status(200).json({ message: 'Rating submitted successfully', averageRating: itinerary.averageRating });
  } catch (error) {
      console.error("Error in rateItinerary:", error); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
  }
};



//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, redeemPoints, chooseCategory, bookActivity, bookItinerary, addComment, reviewProduct,rateTourGuide,rateItinerary};

