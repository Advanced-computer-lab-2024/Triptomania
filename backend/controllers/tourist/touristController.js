// Import userModel and other modules using ES module syntax
import mongoose from 'mongoose';
import userModel from '../../models/tourist.js';
import tourguide from '../../models/tourGuide.js'; // Adjust the path as necessary
import activityModel from '../../models/activity.js';
import itineraryModel from '../../models/itinerary.js';
import productModel from '../../models/product.js';
import complaintModel from '../../models/complaint.js';
import activityCategoryModel from '../../models/activityCategory.js';
import { amadeus, getAccessToken } from '../../config/amadeus.js';
import axios from 'axios';

// Create a new tourist
const CreateTourist = async (req, res) => {
  const { firstName, lastName, username, email, password, mobile, nationality, DOB, job_Student/*, wallet*/ } = req.body

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
    const tourist = await userModel.create({ firstName, lastName, username, email, password, mobile, nationality, DOB, job_Student, underage: isUnderage });
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
  const { id } = req.params; 
  try {
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid tourist ID format' });
    }

    // Find the tourist by ID
    const tourist = await userModel.findById(id);

    
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    
    return res.status(200).json(tourist);
  } catch (error) {
    console.error('Error getting tourist:', error);
    return res.status(500).json({ message: 'Error fetching tourist information', error: error.message });
  }
};


////////////////////////////////////////////////////////////////


// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, mobile, nationality, job_Student, wallet, points } = req.body;
    console.log('Request Body:', req.body); // Log the incoming request

    // Fetch the existing tourist data
    const existingTourist = await userModel.findOne({ username });
    if (!existingTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      firstName: firstName !== undefined ? firstName : existingTourist.firstName,
      lastName: lastName !== undefined ? lastName : existingTourist.lastName,
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
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    const tourist = await userModel.findOne({ _id: id });

    if (!tourist) {
      return res.status(404).send({ message: 'Tourist not found' });
    }

    if (tourist.points < 5000) {
      return res.status(400).json({ message: "Insufficient points to redeem." });
    }

    // Calculate redeemable points (round down to the nearest multiple of 5000)
    const redeemablePoints = Math.floor(tourist.points / 5000) * 5000;
    const pointsToRedeem = redeemablePoints * 0.01;

    tourist.wallet += pointsToRedeem;
    tourist.points -= redeemablePoints;

    // Update badge logic directly
    if (tourist.points <= 100000) {
      tourist.level = 1;
      tourist.badge = 'BRONZE';
    } else if (tourist.points <= 500000) {
      tourist.level = 2;
      tourist.badge = 'SILVER';
    } else {
      tourist.level = 3;
      tourist.badge = 'GOLD';
    }

    // Save the updated tourist details
    await tourist.save();

    res.status(200).json({ 
      message: "Wallet and badge updated successfully", 
      wallet: tourist.wallet, 
      remainingPoints: tourist.points, 
      badge: tourist.badge 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating wallet and badge", error: error.message });
  }
};




const addComment = async (req, res) => {
  const { type, comment, touristId } = req.body; // Get the type and comment from the request body
  const { id } = req.params; // Get the ID from the URL parameter

  try {
    const currentDate = new Date();
    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    let addedComment;

    // Add comment depending on the type
    switch (type) {
      case "activity":
        // Checks if tourist participated in that activity
        const activityCheck = await activityModel.findById(id);
        if (!activityCheck.bookingMade.includes(touristId)) {
          return res.status(403).json({ error: 'You must participate in the activity to comment it' });
        }

        
        if (currentDate < activityCheck.date) {
          return res.status(403).json({ error: 'You can only comment after the activity date.' });
        }

        addedComment = await activityModel.findByIdAndUpdate(
          id,
          { $push: { comments: comment } },
          { new: true } // Return the updated document
        );
        break;

      case "tourGuide":
        // Checks if tourist was with this tour guide
        const tourGuideCheck = await itineraryModel.findById(id);
        if (!tourGuideCheck.bookingMade.includes(touristId)) {
            return res.status(403).json({ error: 'You must participate with this tour guide to leave a comment' });
        }

        if (currentDate < itineraryModel.End_date) {
          return res.status(403).json({ error: 'You can only comment after the itinerary date.' });
        }
        
        const tourGuideid = tourGuideCheck.creatorId;
        addedComment = await tourguide.findByIdAndUpdate(
          tourGuideid,
          { $push: { comments: comment } },
          { new: true } // Return the updated document
        );
        break;

      case "itinerary":
        // Checks if tourist participated in that itinerary
        const itineraryCheck = await itineraryModel.findById(id);
        if (!itineraryCheck.bookingMade.includes(touristId)) {
          return res.status(403).json({ error: 'You must participate in the itinerary to comment it' });
        }

        if (currentDate < itineraryModel.End_date) {
          return res.status(403).json({ error: 'You can only comment after the itinerary date.' });
        }

        addedComment = await itineraryModel.findByIdAndUpdate(
          id,
          { $push: { comments: comment } },
          { new: true } // Return the updated document
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid type specified." });
    }

    // Check if the entity was found and updated
    if (!addedComment) {
      return res.status(404).json({ error: `${type} not found` });
    }

    // Send the updated document with the new comment
    res.status(200).json(addedComment);

  } catch (error) {
    console.log('Error:', error); // Log the error if there's any
    res.status(500).json({ error: error.message });
  }
};


// Add review to a product
const reviewProduct = async (req, res) => {
  const { review, touristId } = req.body; // Get the review from the request body
  const { id } = req.params; // Get the product ID from the URL parameters

  try {
    // Find the product by ID
    const product = await productModel.findById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the touristId is in the Purchasers array
    if (!product.Purchasers.includes(touristId)) {
      return res.status(403).json({ error: 'You must purchase the product to review it' });
    }
    // Find the product by ID and add the review to the Reviews array
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $push: { Reviews: review } },
      { new: true } // Return the updated document
    );

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
      return res.status(403).json({ error: 'You have not booked this itinerary' });
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

    if (activity.bookingMade.includes(_id)) {
      return res.status(400).json({ message: 'You have already booked this activity.' });
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

    if (itinerary.bookingMade.includes(_id)) {
      return res.status(400).json({ message: 'You have already booked this Itinerary.' });
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

const badge = async (req, res) => {
  const { _id } = req.params;

  try {

    const tourist = await userModel.findById(_id);

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }


    if (tourist.points <= 100000) {
      tourist.level = 1;
    } else if (tourist.points <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }


    switch (tourist.level) {
      case 1:
        tourist.badge = 'BRONZE';
        break;
      case 2:
        tourist.badge = 'SILVER';
        break;
      case 3:
        tourist.badge = 'GOLD';
        break;
      default:
        tourist.badge = 'BRONZE';
    }


    await tourist.save();

    res.status(200).json({ message: 'Level and badge updated successfully!', tourist });
  } catch (error) {
    console.error('Error updating level and badge:', error);
    res.status(500).json({ message: 'Error updating level and badge', error: error.message });
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

    // Check if the user has made a booking for this itinerary
    const hasBooked = itinerary.bookingMade.some(id => id.equals(touristId));
    if (!hasBooked) {
      return res.status(403).json({ message: 'You must have a valid booking to rate this itinerary' });
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
    itinerary.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Save the updated itinerary
    await itinerary.save();

    res.status(200).json({ message: 'Rating submitted successfully', averageRating: itinerary.averageRating });
  } catch (error) {
    console.error("Error in rateItinerary:", error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

//////////////////////////////////////////////////////////////////////

async function rateActivity(req, res) {
  const { activityId, rating } = req.body;
  const touristId = req.params.touristId;

  // Check if all required fields are provided
  if (!activityId || rating === undefined || !touristId) {
    return res.status(400).json({ message: 'Activity ID, rating, and tourist ID are required' });
  }

  try {
    // Find the activity by its ID
    const activity = await activityModel.findById(activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Check if the current date is after the activity's date
    const currentDate = new Date();
    if (currentDate < activity.date) {
      return res.status(400).json({ message: 'You cannot rate an upcoming activity' });
    }

    // Check if the tourist has made a booking for this activity
    const hasBooked = activity.bookingMade.some(id => id.equals(touristId));
    if (!hasBooked || !activity.isBookingOpen) {
      return res.status(400).json({ message: 'You must have a valid booking to rate this activity' });
    }

    // Initialize ratings if undefined
    if (!activity.ratings) {
      activity.ratings = [];
    }

    // Check if the user has already rated this activity
    const hasRated = activity.ratings.some(r => r.touristId && r.touristId.equals(touristId));
    if (hasRated) {
      return res.status(400).json({ message: 'You have already rated this activity' });
    }

    // Add the user's rating to the activity's ratings array
    activity.ratings.push({ touristId, rating });

    // Debugging: Log the ratings array
    console.log('Ratings Array:', activity.ratings);

    // Calculate new average rating
    const totalRatings = activity.ratings.length;
    const sumRatings = activity.ratings.reduce((sum, rate) => sum + rate.rating, 0);

    // Prevent division by zero and update averageRating
    activity.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Debugging: Log the calculated average rating
    console.log('New Average Rating:', activity.averageRating);

    // Save the updated activity
    await activityModel.findByIdAndUpdate(activityId, { ratings: activity.ratings, averageRating: activity.averageRating }, { new: true });

    res.status(200).json({ message: 'Rating submitted successfully', averageRating: activity.averageRating });
  } catch (error) {
    console.error("Error in rateActivity:", error); // Log the error for debugging
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

//////////////////////////////////////////////////////////////////////
const processPayment = async (req, res) => {
  const { _id } = req.params; // Tourist ID
  const { itemId } = req.body; // Item ID

  try {
    // Fetch the tourist by ID
    const tourist = await userModel.findById(_id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Search for the item in Itinerary, Activity, and Product collections
    let item = await itineraryModel.findById(itemId);
    let itemType = 'itinerary';

    if (!item) {
      item = await activityModel.findById(itemId);
      itemType = item ? 'activity' : itemType;
    }

    if (!item) {
      item = await productModel.findById(itemId);
      itemType = item ? 'product' : itemType;
    }

    // If item not found in any collection
    if (!item) {
      return res.status(404).json({ message: 'Item not found in Itinerary, Activity, or Product collections.' });
    }

    // Log the item's price for debugging
    const itemPrice = item.price || item.Price;

    // Check for sufficient funds
    //if (tourist.wallet < itemPrice) {
    //return res.status(400).json({ message: 'Insufficient funds in wallet.' });
    //}

    // Deduct the item's price from the tourist's wallet
    //tourist.wallet -= itemPrice; // Deduct from wallet

    // Calculate loyalty points only for itineraries and activities
    let pointsEarned = 0;

    if (itemType === 'itinerary' || itemType === 'activity') {
      if (tourist.level === 1) {
        pointsEarned = itemPrice * 0.5;
      } else if (tourist.level === 2) {
        pointsEarned = itemPrice * 1;
      } else if (tourist.level === 3) {
        pointsEarned = itemPrice * 1.5;
      }
    }

    // Update the tourist's points
    tourist.points += pointsEarned;

    // Call the method to update the badge and level
    await updateBadge(tourist);

    // Prepare update data for the tourist
    const updateData = {
      wallet: tourist.wallet,
      points: tourist.points,
      level: tourist.level, // Ensure level is included
      badge: tourist.badge, // Ensure badge is included
    };

    // Update the tourist's information
    const updatedTourist = await userModel.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found during update.' });
    }

    res.status(200).json({
      message: 'Payment processed successfully!',
      walletBalance: updatedTourist.wallet,
      totalPoints: updatedTourist.points, // Include total points
      badge: updatedTourist.badge, // Include updated badge
      itemDetails: item,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Method to update badge and level
const updateBadge = async (tourist) => {
  try {
    // Update the level and badge based on points
    if (tourist.points <= 100000) {
      tourist.level = 1;
      tourist.badge = 'BRONZE';
    } else if (tourist.points <= 500000) {
      tourist.level = 2;
      tourist.badge = 'SILVER';
    } else {
      tourist.level = 3;
      tourist.badge = 'GOLD';
    }

    // Save the tourist document to update the database
    await tourist.save();
    console.log('Level and badge updated successfully!', tourist);
  } catch (error) {
    console.error('Error updating level and badge:', error);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
const rateProduct = async (req, res) => {
  const { productId, rating } = req.body; // Extract productId and rating from request body
  const touristId = req.params.touristId; // Extract touristId from request parameters

  // Check if all required fields are provided
  if (!productId || rating === undefined || !touristId) {
    return res.status(400).json({ message: 'Product ID, rating, and tourist ID are required' });
  }

  try {
    // Validate input
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }

    // Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    // Initialize ratings if undefined
    if (!product.Rating) {
      product.Rating = [];
    }
    // Check if the tourist is in the list of purchasers
    const isPurchaser = product.Purchasers.some(id => id.equals(touristId));
    if (!isPurchaser) {
      return res.status(403).json({ message: 'Only purchasers of this product can rate it.' });
    }

    // Check if the tourist has already rated this product
    const hasRated = product.Rating.some(r => r.touristId && r.touristId.equals(touristId));
    if (hasRated) {
      return res.status(400).json({ message: 'You have already rated this product.' });
    }

    // Add a new rating
    product.Rating.push({ touristId: new mongoose.Types.ObjectId(touristId), rating });

    // Calculate new average rating
    const totalRatings = product.Rating.length;
    const sumRatings = product.Rating.reduce((sum, rate) => sum + rate.rating, 0);

    // Update averageRating
    product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product rated successfully!', averageRating: product.averageRating });
  } catch (error) {
    console.error('Error rating product:', error);
    res.status(500).json({ message: 'Error rating product', error: error.message });
  }
};

const fileComplaint = async (req, res) => {
  const { title, body } = req.body;
  const { touristId } = req.params;

  console.log(touristId);

  try {
    // Verify the tourist exists
    const tourist = await userModel.findOne({ _id: touristId });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    const complaint = new complaintModel({
      title,
      body,
      touristId
    });

    await complaint.save();

    res.status(201).json({ complaint, message: 'Complaint filed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const viewMyComplaints = async (req, res) => {
  try {
    const { touristId } = req.params;

    const complaints = await complaintModel.find({ touristId });

    return res.status(200).json({ message: 'Complaints retrieved successfully', complaints });
  } catch (error) {
    console.log(error);
  }
};

const choosePreferences = async (req, res) => {
  const { preferences } = req.body;
  const { touristId } = req.params;

  try {
    // Verify the tourist exists
    const tourist = await userModel.findByIdAndUpdate(touristId, { $set: {preferences: preferences} }, { new: true });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }
    
    res.status(200).json({ message: 'Preferences updated successfully', tourist: tourist });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//////////////////////////////////////////////////////////////////\
const isCancellationAllowed = (eventDate) => {
  const now = new Date();
  const eventStartDate = new Date(eventDate);
  const diffInMs = eventStartDate - now;
  const diffInHours = diffInMs / (1000 * 60 * 60);  // Convert milliseconds to hours
  return diffInHours > 48; // Return true if more than 48 hours before the event
};

// Cancel booking for either Activity or Itinerary
export const cancelBooking = async (req, res) => {
  try {
    const touristId = req.params.touristId;  // Correctly capture the touristId from the URL
    const { itemId } = req.body;             // Capture itemId from the request body

    // Validate if the touristId is a valid ObjectId
    if (!touristId || !mongoose.Types.ObjectId.isValid(touristId)) {
        return res.status(400).json({ message: "Invalid tourist ID format or missing tourist ID" });
    }

    // Validate if the itemId is a valid ObjectId
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid item ID format or missing item ID" });
    }

    // Search for the item in itineraryModel first
    let item = await itineraryModel.findById(itemId);
    let itemType = 'itinerary';

    // If it's not found in the itinerary, try finding it in the activityModel
    if (!item) {
        item = await activityModel.findById(itemId);
        itemType = item ? 'activity' : itemType;
    }

    // If the item is not found, return an error
    if (!item) {
        return res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }

    // Ensure the touristId is in the bookingMade array
    const bookingIndex = item.bookingMade.indexOf(touristId);
    if (bookingIndex === -1) {
        return res.status(400).json({ message: `Tourist with ID ${touristId} did not book this item` });
    }

    // Get the date of the item (activity or itinerary)
    const itemDate = new Date(item.date || item.Start_date);  // Use date from activity or Start_date from itinerary

    // Ensure cancellation is happening at least 48 hours before the event
    if (!isCancellationAllowed(itemDate)) {
        return res.status(400).json({ message: `Cancellation window has passed. You can cancel up to 48 hours before the start of the ${itemType}` });
    }

    // Remove the booking from the bookingMade array
    item.bookingMade.splice(bookingIndex, 1);

    // Update only the bookingMade field using updateOne to bypass validation
    await item.updateOne({ $set: { bookingMade: item.bookingMade } });

    // Return success message
    return res.status(200).json({ message: "Booking canceled successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getHotels = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: 'Hotel city is required' });
    }

    // Call Amadeus Hotel Search API
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: city, // Replace CITY_CODE with the relevant city code, or add it as a request parameter if needed
    });

    // Check for valid response
    if (response.data && response.data.length > 0) {
      res.status(200).json({
        hotels: response,
      });
    } else {
      res.status(404).json({ message: 'No hotels found' });
    }
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: error });
  }
}

const getHotelOffers = async (req, res) => {
  try {
    const { hotelId } = req.query;

    if (!hotelId) {
      return res.status(400).json({ error: 'Hotel ID is required' });
    }

    const response = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelId,
    });

    if (response.data && response.data.length > 0) {
      res.status(200).json({
        offers: response.data,
      });
    } else {
      res.status(404).json({ message: 'No offers found for this hotel' });
    }
  } catch (error) {
    console.error('Error fetching hotel offers:', error);

    // Check if the error code matches the "No Rooms Available" error
    if (error.description && error.description[0].code === 3664) {
      res.status(400).json({ error: 'No rooms available at the requested property' });
    } else {
      res.status(500).json({ error: 'Failed to fetch hotel offers' });
    }
  }
};

async function getValidAccessToken() {
  const { accessToken, tokenExpiryTimestamp } = await getAccessToken();
  return accessToken;
}

const bookHotel = async (req, res) => {
  const { id } = req.params;
  const { offerId, payment } = req.body;

  if (!offerId || !payment) {
    return res.status(400).json({ error: 'Offer ID and payment details are required' });
  }

  try {
    // Retrieve user information
    const tourist = await userModel.findOne({ _id: id });
    if (!tourist) {
      return res.status(404).json({ message: 'No tourist found' });
    }

    // Step 1: Fetch a valid access token
    const accessToken = await getValidAccessToken();

    // Step 2: Validate offer pricing immediately before booking
    const pricingResponse = await axios.get(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers/${offerId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (pricingResponse.status !== 200 || !pricingResponse.data || !pricingResponse.data.data.offers) {
      return res.status(400).json({ error: 'Offer is unavailable or has changed' });
    }

    const bookingData = {
      data: {
        type: 'hotel-order',
        roomAssociations: [
          {
            guestReferences: [
              {
                guestReference: '1'
              }
            ],
            hotelOfferId: offerId  // Use the validated offerId here
          }
        ],
        travelAgent: {
          contact: {
            email: 'bob@example.com'
          }
        },
        guests: [
          {
            tid: 1,
            title: 'MR',
            firstName: tourist.firstName || 'Bob',  // Use firstName from tourist data
            lastName: tourist.lastName || 'Doe',  // Use lastName from tourist data
            phone: tourist.mobile,
            email: tourist.email
          }
        ],
        payment: {
          method: payment.method,
          paymentCard: {
            paymentCardInfo: {
              vendorCode: payment.vendorCode,
              cardNumber: payment.cardNumber,
              expiryDate: payment.expiryDate,
              holderName: payment.holderName,
            },
          },
        },
      }
    };

    let response = await amadeus.booking.hotelOrders.post(bookingData);

    await userModel.findByIdAndUpdate(id, { $push: { hotelBookings: response.data.id } });

    return res.status(200).json(response.data);  // Send booking response back to client

  } catch (error) {
    console.error('Error booking hotel:', error);
    return res.status(500).json({ error: 'Failed to book hotel' });
  }
};

let flightOffersCache = null;

const searchFlights = async (req, res) => {
  try {
    // Extract parameters from the request body
    const { origin, destination, departure_date, return_date } = req.body;

    // Validate required parameters
    if (!origin || !destination || !departure_date) {
      return res.status(400).json({ error: 'Missing required parameters: origin, destination, departure_date' });
    }

    // Prepare the query parameters for Amadeus flight search
    const queryParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departure_date,
      returnDate: return_date,  // Optional
      adults: 1  // Default to 1 adult if not provided
    };

    // Perform the flight search via the Amadeus API
    let flightOffers;
    await amadeus.shopping.flightOffersSearch.get(queryParams).then(
      function (response) {
        flightOffersCache = response;
      }
    );

    // Return the flight offers data
    return res.status(200).json(flightOffersCache.data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error searching for flights', details: error.message });
  }
};

const getFlightDetails = async (req, res) => {
  try {
    const { flightOfferId } = req.params; // Get flight offer ID from the URL parameters

    if (!flightOfferId) {
      return res.status(400).json({ error: 'Flight offer ID is required' });
    }

    const flightDetails = await amadeus.shopping.flightOffers.pricing.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffersCache.data.find(offer => offer.id === flightOfferId)],
      },
    });

    // Return the flight details if found
    if (flightDetails && flightDetails.data) {
      return res.status(200).json(flightDetails.data);
    } else {
      return res.status(404).json({ error: 'Flight details not found' });
    }

  } catch (error) {
    console.error('Error fetching flight details:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const bookFlight = async (req, res) => {
  try {
    const { flight_offer, documents } = req.body;
    const { id } = req.params;
    // Validate the required fields
    if (!flight_offer) {
      return res.status(400).json({ error: 'Missing required parameters for booking' });
    }

    const tourist = await userModel.findById(id);

    // Create the booking request data
    const bookingData = {
      data: {
        type: "flight-order",
        flightOffers: [flightOffersCache.data.find(offer => offer.id === flight_offer)],
        travelers: [
          {
            id: "1",
            dateOfBirth: '1982-01-16',
            name: {
              firstName: tourist.firstName || "BOB",
              lastName: tourist.lastName || "SMITH",
            },
            gender: "MALE",
            contact: {
              emailAddress: tourist.email,
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "34",
                  number: tourist.mobile,
                },
              ],
            },
            documents: documents,
          },
        ],
      }
    };

    // Call Amadeus API to book the flight
    const bookingResponse = await amadeus.booking.flightOrders.post(bookingData);

    await userModel.findByIdAndUpdate(id, { $push: { flightBookings: bookingResponse.data.id } });

    // Return the booking response
    return res.status(201).json(bookingResponse.data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error booking the flight', details: error.message });
  }
};

// const hotel = async (req, res) => {
//   try {
//     // Book a hotel in BLR for 2024-10-10 to 2024-10-12 for 1 guest

//     // 1. Hotel List API to get the list of hotels
//     const hotelsList = await amadeus.referenceData.locations.hotels.byCity.get({
//       cityCode: "CAI",
//     });

//     console.log(hotelsList.data[14]);

//     // 2. Hotel Search API to get the price and offer id
//     const pricingResponse = await amadeus.shopping.hotelOffersSearch.get({
//       hotelIds: hotelsList.data[29].hotelId,
//       adults: 1,
//       checkInDate: "2024-12-10",
//       checkOutDate: "2024-12-12",
//     });

//     // Finally, Hotel Booking API to book the offer
//     const response = await amadeus.booking.hotelOrders.post({
//       data: {
//         type: "hotel-order",
//         guests: [
//           {
//             tid: 1,
//             title: "MR",
//             firstName: "BOB",
//             lastName: "SMITH",
//             phone: "+33679278416",
//             email: "bob.smith@email.com",
//           },
//         ],
//         travelAgent: {
//           contact: {
//             email: "bob.smith@email.com",
//           },
//         },
//         roomAssociations: [
//           {
//             guestReferences: [
//               {
//                 guestReference: "1",
//               },
//             ],
//             hotelOfferId: pricingResponse.data[0].offers[0].id,
//           },
//         ],
//         payment: {
//           method: "CREDIT_CARD",
//           paymentCard: {
//             paymentCardInfo: {
//               vendorCode: "VI",
//               cardNumber: "4151289722471370",
//               expiryDate: "2026-08",
//               holderName: "BOB SMITH",
//             },
//           },
//         },
//       },
//     });
//     console.log(response);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }

// const flight = async (req, res) => {
//   try {
//     // Book a flight from MAD to ATH on 2022-08-01
//     const flightOffersResponse = await amadeus.shopping.flightOffersSearch.get({
//       originLocationCode: "MAD",
//       destinationLocationCode: "ATH",
//       departureDate: "2025-08-01",
//       adults: "1",
//     });

//     const pricingResponse = await amadeus.shopping.flightOffers.pricing.post({
//       data: {
//         type: "flight-offers-pricing",
//         flightOffers: [flightOffersResponse.data[0]],
//       },
//     });

//     const response = await amadeus.booking.flightOrders.post({
//       data: {
//         type: "flight-order",
//         flightOffers: [pricingResponse.data.flightOffers[0]],
//         travelers: [
//           {
//             id: "1",
//             dateOfBirth: "1982-01-16",
//             name: {
//               firstName: "JORGE",
//               lastName: "GONZALES",
//             },
//             gender: "MALE",
//             contact: {
//               emailAddress: "jorge.gonzales833@telefonica.es",
//               phones: [
//                 {
//                   deviceType: "MOBILE",
//                   countryCallingCode: "34",
//                   number: "480080076",
//                 },
//               ],
//             },
//             documents: [
//               {
//                 documentType: "PASSPORT",
//                 birthPlace: "Madrid",
//                 issuanceLocation: "Madrid",
//                 issuanceDate: "2015-04-14",
//                 number: "00000000",
//                 expiryDate: "2025-04-14",
//                 issuanceCountry: "ES",
//                 validityCountry: "ES",
//                 nationality: "ES",
//                 holder: true,
//               },
//             ],
//           },
//         ],
//       },
//     });
//     console.log(response);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// }

const bookTransportation = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, travelDate, travelTime, travelType } = req.body;

    if (!origin || !destination || !travelDate || !travelTime || !travelType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const transportationData = {
      origin: origin,
      destination: destination,
      travelDate: travelDate,
      travelTime: travelTime,
      travelType: travelType
    };

    await userModel.findByIdAndUpdate(id, { $push: { transportationBookings: transportationData } }, {new: true});
    res.status(200).json({message: "transportation added successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


// Export all functions using ES module syntax
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, getHotels, getHotelOffers, bookHotel, searchFlights, getFlightDetails, bookFlight, bookTransportation, redeemPoints, chooseCategory, bookActivity, bookItinerary, addComment, reviewProduct, rateTourGuide, rateItinerary, rateActivity, badge, processPayment, rateProduct, updateBadge, fileComplaint, viewMyComplaints, choosePreferences,cancelBooking };



