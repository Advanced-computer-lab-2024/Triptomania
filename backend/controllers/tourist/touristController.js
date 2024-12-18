// Import userModel and other modules using ES module syntax
import mongoose from 'mongoose';
import userModel from '../../models/tourist.js';
import tourguide from '../../models/tourGuide.js'; // Adjust the path as necessary
import activityModel from '../../models/activity.js';
import itineraryModel from '../../models/itinerary.js';
import productModel from '../../models/product.js';
import complaintModel from '../../models/complaint.js';
import activityCategoryModel from '../../models/activityCategory.js';
import orderModel from '../../models/order.js';
import { amadeus, getAccessToken } from '../../config/amadeus.js';
import axios from 'axios';
import promoCodeModel from '../../models/promoCode.js';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import notificationModel from '../../models/notification.js';

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const transactionalEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

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
    res.status(404).json({ message: error.message });
  }
};

////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////

// Get one tourist

const getOneTourist = async (req, res) => {
  const id = req.user._id;
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
    return res.status(500).json({ message: 'Error fetching tourist information', error: error.message });
  }
};


////////////////////////////////////////////////////////////////


// Update a tourist
const UpdateTourist = async (req, res) => {
  try {
    const { firstName, lastName, username, email, mobile, nationality, job_Student } = req.body;

    // Fetch the existing tourist data
    const existingTourist = await userModel.findOne({ username });
    if (!existingTourist) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = {
      firstName: firstName !== undefined ? firstName : existingTourist.firstName,
      lastName: lastName !== undefined ? lastName : existingTourist.lastName,
      mobile: mobile !== undefined ? mobile : existingTourist.mobile,
      nationality: nationality !== undefined ? nationality : existingTourist.nationality,
      job_Student: job_Student !== undefined ? job_Student : existingTourist.job_Student
    };


    // Remove undefined fields (optional as we've handled undefined values)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

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

    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const badge = async (req, res) => {
  const _id = req.user._id;

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
    res.status(500).json({ message: 'Error updating level and badge', error: error.message });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const id = req.user._id;

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

    // Update badge logic directly after redeeming points
    // This checks if the current points qualify for a higher badge
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

    tourist.wallet += pointsToRedeem;
    tourist.points -= redeemablePoints;
    // Save the updated tourist details
    await tourist.save();

    res.status(200).json({
      message: "Wallet and badge updated successfully",
      wallet: tourist.wallet,
      remainingPoints: tourist.points,
      badge: tourist.badge,
      level: tourist.level
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating wallet and badge", error: error.message });
  }
};




//TODO : Update this method functionality
const addComment = async (req, res) => {
  const { type, comment, id } = req.body; // Get the type and comment from the request body
  const touristId = req.user._id;

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

        const tourGuideCheck = await itineraryModel.find({ creatorId: id });
        let tourGuideid;
        tourGuideCheck.forEach(async (itinerary) => {
          if (itinerary.bookingMade.includes(touristId)) {
            if (currentDate < itinerary.End_date) {
              return res.status(403).json({ error: 'You can only comment after the tour date' });
            } else {
              tourGuideid = itinerary.creatorId;
            }
          }
        });

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
    res.status(500).json({ error: error.message });
  }
};


// Add review to a product
const reviewProduct = async (req, res) => {
  const { review, id } = req.body; // Get the review from the request body
  const touristId = req.user._id;

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
    res.status(400).json({ error: error.message });
  }
};

/////////////////////////////////////////////////////////////////
export const rateTourGuide = async (req, res) => {
  const { itineraryId, rating } = req.body; // Get itineraryId and rating from request body
  const touristId = req.user._id;

  try {
    // Verify if the tourist exists
    const tourist = await userModel.findById(touristId);
    if (!tourist) return res.status(404).json({ error: 'Tourist not found' });

    // Find the itinerary
    const itinerary = await itineraryModel.findById(itineraryId);
    if (!itinerary) return res.status(404).json({ error: 'Itinerary not found' });

    // Check if the tourist completed the itinerary by checking bookingMade
    if (!itinerary.bookingMade.includes(touristId)) {
      return res.status(403).json({ error: 'You have not booked an itinerary with this tour guide' });
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
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};





const chooseCategory = async (req, res) => { //frontend will be list of categories once tourist click on 
  // specific category all details of it appears
  try {
    const id = req.user._id;

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
  const { activityId } = req.body;
  const _id = req.user._id;

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

    if (activity.bookingMade.includes(_id)) {
      return res.status(400).json({ message: 'You have already booked this activity.' });
    }



    // Proceed with booking
    activity.bookingMade.push(_id);
    const eventMap = {
      name: activity.name,
      eventType: 'activity',
      eventId: activityId,
      date: activity.date,
      status: 'Pending'
    }
    // Proceed with booking
    tourist.activities.push(eventMap);
    await tourist.save();
    activity.bookingMade.push(_id); // Add the touristId to the activity's bookingMade array


    // Save the updated activity and tourist objects
    await activity.save(); // Save the updated activity with the new booking


    res.status(200).json({ message: 'Activity booked successfully!', activity });
  } catch (error) {
    res.status(500).json({ message: 'Error booking activity', error: error.message });
  }
};



const bookItinerary = async (req, res) => {
  const { itineraryId } = req.body;
  const _id = req.user._id;

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


    if (itinerary.bookingMade.includes(_id)) {
      return res.status(400).json({ message: 'You have already booked this Itinerary.' });
    }

    // Proceed with booking
    itinerary.bookingMade.push(_id);
    const eventMap = {
      name: itinerary.Name,
      eventType: 'itinerary',
      eventId: itineraryId,
      date: itinerary.Start_date,
      status: 'Pending'
    }
    tourist.itineraries.push(eventMap);
    await tourist.save();
    // Save the updated activity and tourist objects
    await itinerary.save(); // Save the updated activity with the new booking

    res.status(200).json({ message: 'Itinerary booked successfully!', itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Error booking itinerary', error: error.message });
  }
};


//////////////////////////////////////////////////////////////////////
export const rateItinerary = async (req, res) => {
  const { itineraryId, rating } = req.body;
  const touristId = req.user._id;

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
    res.status(500).json({ message: 'Server error' });
  }
};

//////////////////////////////////////////////////////////////////////

async function rateActivity(req, res) {
  const { activityId, rating } = req.body;
  const touristId = req.user._id;

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

    // Calculate new average rating
    const totalRatings = activity.ratings.length;
    const sumRatings = activity.ratings.reduce((sum, rate) => sum + rate.rating, 0);

    // Prevent division by zero and update averageRating
    activity.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Debugging: Log the calculated average rating

    // Save the updated activity
    await activityModel.findByIdAndUpdate(activityId, { ratings: activity.ratings, averageRating: activity.averageRating }, { new: true });

    res.status(200).json({ message: 'Rating submitted successfully', averageRating: activity.averageRating });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}

//////////////////////////////////////////////////////////////////////

const processPayment = async (req, res) => {
  const _id = req.user._id;
  const { price } = req.body; // Item ID

  try {
    // Fetch the tourist by ID
    const tourist = await userModel.findById(_id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Calculate loyalty points only for itineraries and activities
    let pointsEarned = 0;

    if (tourist.level === 1) {
      pointsEarned = price * 0.5;
    } else if (tourist.level === 2) {
      pointsEarned = price * 1;
    } else if (tourist.level === 3) {
      pointsEarned = price * 1.5;
    }

    // tourist.points += pointsEarned;
    // await updateBadge(tourist);

    // Save all changes
    await tourist.save();

    res.status(200).json({
      message: 'Payment processed successfully!',
      walletBalance: tourist.wallet,
      totalPoints: tourist.points,
      badge: tourist.badge,
      itemDetails: item,
      status: 'Paid',
      itemType
    });
  } catch (error) {
    console.error('Processing payment error:', error); // Add this for debugging
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
  } catch (error) {
    throw new Error(error.message);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////
const rateProduct = async (req, res) => {
  const { productId, rating } = req.body;
  const touristId = req.user._id;

  try {
    // Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if tourist has purchased the product
    if (!product.Purchasers.includes(touristId)) {
      return res.status(403).json({ error: 'You must purchase the product to rate it' });
    }

    // Check if tourist has already rated
    const existingRating = product.Rating.find(r => r.touristId.equals(touristId));
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this product' });
    }

    // Add new rating
    product.Rating.push({ touristId, rating });

    // Calculate new average rating
    const totalRatings = product.Rating.length;
    const sumRatings = product.Rating.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    await product.save();

    res.status(200).json({
      message: 'Rating submitted successfully',
      averageRating: product.averageRating
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const fileComplaint = async (req, res) => {
  const { title, body } = req.body;
  const touristId = req.user._id;


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
    const touristId = req.user._id;

    const complaints = await complaintModel.find({ touristId });

    return res.status(200).json({ message: 'Complaints retrieved successfully', complaints });
  } catch (error) {
  }
};

const choosePreferences = async (req, res) => {
  const { preferences, touristId } = req.query;

  try {
    const pref = preferences.split(',');
    const tourist = await userModel.findByIdAndUpdate(touristId, { $set: { preferences: pref } }, { new: true });
    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    res.status(200).json({ message: 'Preferences updated successfully', tourist: tourist });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updatePreferences = async (req, res) => {
  const { preferences } = req.body;
  const touristId = req.user._id;

  try {
    // Verify the tourist exists
    const tourist = await userModel.findByIdAndUpdate(touristId, { $set: { preferences: preferences } }, { new: true });
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
    const touristId = req.user._id;
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

    const tourist = await userModel.findById(touristId);
    if (itemType == 'itinerary') {
      const itineraryIndex = tourist.itineraries.findIndex(itinerary => itinerary.eventId === itemId);
      if (itineraryIndex !== -1) {
        tourist.itineraries.splice(itineraryIndex, 1);
      }
    } else {
      const activityIndex = tourist.activities.findIndex(activity => activity.eventId === itemId);
      if (activityIndex !== -1) {
        tourist.activities.splice(activityIndex, 1);
      }
    }
    await item.save();
    await tourist.save();

    // Return success message
    return res.status(200).json({ message: "Booking canceled successfully" });

  } catch (error) {
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

    // Check if the error code matches the "No Rooms Available" error
    if (error.description && error.description[0].code === 3664) {
      res.status(400).json({ error: 'No rooms available at the requested property' });
    } else if (error.description && error.description[0].code === 1257) {
      res.status(400).json({ error: 'No offers available for this hotel' });
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
  const id = req.user._id;
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

    await userModel.findByIdAndUpdate(id, { $push: { hotelBookings: response.data } });

    return res.status(200).json(response.data);  // Send booking response back to client

  } catch (error) {
    return res.status(500).json({ error: 'Failed to book hotel', details: error.message });
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
    return res.status(500).json({ error: 'Error searching for flights', details: error.message });
  }
};

const getFlightDetails = async (req, res) => {
  try {
    const { flightOfferId } = req.query; // Get flight offer ID from the URL parameters

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
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

const bookFlight = async (req, res) => {
  try {
    const { flight_offer, documents } = req.body;
    const id = req.user._id;
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
            documents: [documents],
          },
        ],
      }
    };

    // Call Amadeus API to book the flight
    const bookingResponse = await amadeus.booking.flightOrders.post(bookingData);

    await userModel.findByIdAndUpdate(id, { $push: { flightBookings: bookingResponse.data } });

    // Return the booking response
    return res.status(201).json(bookingResponse.data);

  } catch (error) {
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
//     res.status(200).json(response.data);
//   } catch (error) {
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
//     res.status(200).json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

const bookTransportation = async (req, res) => {
  try {
    const id = req.user._id;
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

    await userModel.findByIdAndUpdate(id, { $push: { transportationBookings: transportationData } }, { new: true });
    res.status(200).json({ message: "transportation added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



const addProductToCart = async (req, res) => {
  try {
    const id = req.user._id;
    const { productId, quantity } = req.body; // Product ID and Quantity

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user's cart
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the product already exists in the cart
    const existingCartItem = user.cart.find(item => item.productId.toString() === productId);

    let tempProd;
    let quan = 0;
    if (existingCartItem) {
      tempProd = user.cart.pull({ productId: productId });
      quan = Number(tempProd[0].quantity);
      user.cart.pop({ productId: productId });
    }
    user.cart.push({ productId: productId, quantity: Number(quantity + quan) });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const id = req.user._id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    await userModel.findByIdAndUpdate(id, { $pull: { cart: { productId: productId } } },
      { new: true });
    res.status(200).json({ message: "product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const changeCartQuantity = async (req, res) => {
  try {
    const id = req.user._id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cartItem = {
      productId: productId,
      quantity: quantity
    };
    await userModel.findByIdAndUpdate(id, { $pull: { cart: { productId: productId } } },
      { new: true });
    await userModel.findByIdAndUpdate(id, { $push: { cart: cartItem } }, {
      new:
        true
    });
    res.status(200).json({ message: "cart quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addDeliveryAdress = async (req, res) => {
  try {
    const id = req.user._id;
    const { address, city, state, zip } = req.body;
    if (!address || !city || !state || !zip) {
      return res.status(400).json({ error: 'Address, city, state and zip are required' });
    }
    const deliveryAddress = {
      address: address,
      city: city,
      state: state,
      zip: zip
    };
    await userModel.findByIdAndUpdate(id, { $push: { deliveryAddresses: deliveryAddress } }, { new: true });
    res.status(200).json({ message: "delivery address added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteDeliveryAddress = async (req, res) => {
  try {
    const id = req.user._id;
    const { addressIndex } = req.query;

    if (!addressIndex || addressIndex === 'undefined') {
      return res.status(400).json({ error: 'Address index is required' });
    }

    // Remove the address at the specified index
    await userModel.updateOne(
      { _id: id },
      { $unset: { [`deliveryAddresses.${addressIndex}`]: "" } } // Remove the address at the given index
    );

    // Clean up any 'null' values left in the array after the unset
    await userModel.updateOne(
      { _id: id },
      { $pull: { deliveryAddresses: null } } // Remove any null values left after unset
    );

    res.status(200).json({ message: "Delivery address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const categorizeOrders = (orders) => {
  const today = new Date(); // Get the current date
  today.setHours(0, 0, 0, 0); // Normalize time to midnight for comparison

  return orders.reduce(
    (result, order) => {
      let orderDate = new Date(order.deliveryDate);
      if (!orderDate) {
        orderDate = new Date(order.orderDate);
      }

      if (orderDate >= today) {
        result.upcoming.push(order);
      } else {
        result.past.push(order);
      }

      return result;
    },
    { upcoming: [], past: [] } // Initialize the result object
  );
};

const viewOrders = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findById(id).populate('orders');
    const orders = user.orders;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ orders: categorizeOrders(orders) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const viewOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ order: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const addProductToWishlist = async (req, res) => {
  try {
    const id = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Find the user
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize wishlist if it doesn't exist
    if (!user.whishlist) {
      user.whishlist = [];
    }

    // Check if the product is already in the wishlist
    const isAlreadyInWishlist = user.whishlist.some(
      (item) => item.toString() === productId
    );

    if (isAlreadyInWishlist) {
      return res.status(400).json({ error: 'Product is already in the wishlist' });
    }

    // Add the product to the wishlist
    user.whishlist.push(productId);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getWishlist = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ wishlist: user.whishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getCart = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const removeProductFromWishlist = async (req, res) => {
  try {
    const id = req.user._id;
    const { productId } = req.body; // Product ID

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Use the $pull operator to remove the product from the wishlist
    const user = await userModel.findByIdAndUpdate(
      id,
      { $pull: { whishlist: productId } }, // Pull the productId from the wishlist array
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUpcomingActivities = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const upcomingActivities = user.activities.filter(activity => new Date(activity.date) > new Date());

    res.status(200).json({ upcomingActivities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getUpcomingItineraries = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const upcomingItineraries = user.itineraries.filter(itinerary => new Date(itinerary.date) > new Date());

    res.status(200).json({ upcomingItineraries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getPastActivities = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pastActivities = user.activities.filter(activity => new Date(activity.date) <= new Date());

    res.status(200).json({ pastActivities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getPastItineraries = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pastItineraries = user.itineraries.filter(itinerary => new Date(itinerary.date) <= new Date());

    res.status(200).json({ pastItineraries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const bookmarkEvent = async (req, res) => {
  try {
    const { eventId, eventType } = req.body;
    const id = req.user._id;

    if (!eventId || !eventType) {
      return res.status(400).json({ error: 'Event ID and Type are required' });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let event;
    if (eventType === 'activity') {
      // Only initialize the `activity` variable if eventType is 'activity'
      event = await activityModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      // Check if the activity is already bookmarked
      if (user.bookmarkedActivities.some(bookmarked => bookmarked.toString() === event._id.toString())) {
        return res.status(400).json({ error: 'Activity already bookmarked' });
      }

      user.bookmarkedActivities.push(event._id); // Store only the ID
    } else if (eventType === 'itinerary') {
      // Only initialize the `itinerary` variable if eventType is 'itinerary'
      event = await itineraryModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }

      // Check if the itinerary is already bookmarked
      if (user.bookmarkedItineraries.some(bookmarked => bookmarked.toString() === event._id.toString())) {
        return res.status(400).json({ error: 'Itinerary already bookmarked' });
      }

      user.bookmarkedItineraries.push(event._id); // Store only the ID
    } else {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Event bookmarked successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unbookmarkEvent = async (req, res) => {
  try {
    const { eventId, eventType } = req.body;
    const id = req.user._id;

    if (!eventId || !eventType) {
      return res.status(400).json({ error: 'Event ID and Type are required' });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let event;
    if (eventType === 'activity') {
      // Only initialize the `activity` variable if eventType is 'activity'
      event = await activityModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Activity not found' });
      }

      // Check if the activity is bookmarked
      if (!user.bookmarkedActivities.some(bookmarked => bookmarked.toString() === event._id.toString())) {
        return res.status(400).json({ error: 'Activity is not bookmarked' });
      }

      user.bookmarkedActivities.pull(event._id); // Pull by ID
    } else if (eventType === 'itinerary') {
      // Only initialize the `itinerary` variable if eventType is 'itinerary'
      event = await itineraryModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }

      // Check if the itinerary is bookmarked
      if (!user.bookmarkedItineraries.some(bookmarked => bookmarked.toString() === event._id.toString())) {
        return res.status(400).json({ error: 'Itinerary is not bookmarked' });
      }

      user.bookmarkedItineraries.pull(event._id); // Pull by ID
    } else {
      return res.status(400).json({ error: 'Invalid event type' });
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Event unbookmarked successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBookmarkedEvents = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activities = user.bookmarkedActivities;
    const itineraries = user.bookmarkedItineraries;

    const bookmarkedEvents = {
      activities: activities,
      itineraries: itineraries
    };

    res.status(200).json({ bookmarkedEvents: bookmarkedEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const categorizeHotelBookings = (hotelBookings) => {
  const today = new Date(); // Get the current date

  return hotelBookings.reduce(
    (result, bookingGroup) => {
      bookingGroup.hotelBookings.forEach((booking) => {
        const checkInDate = new Date(booking.hotelOffer.checkInDate);

        if (checkInDate >= today) {
          result.upcoming.push(booking);
        } else {
          result.past.push(booking);
        }
      });

      return result;
    },
    { upcoming: [], past: [] } // Initialize the result object
  );
};

const categorizeFlightBookings = (flightBookings) => {
  const today = new Date(); // Get the current date

  return flightBookings.reduce(
    (result, bookingGroup) => {
      bookingGroup.flightOffers.forEach((offer) => {
        offer.itineraries.forEach((itinerary) => {
          // Find the departure date of the first segment
          const lastSegment = itinerary.segments[itinerary.segments.length - 1];
          const departureDate = new Date(lastSegment.departure.at);

          if (departureDate >= today) {
            result.upcoming.push(offer);
          } else {
            result.past.push(offer);
          }
        });
      });

      return result;
    },
    { upcoming: [], past: [] } // Initialize the result object
  );
};

const categorizeTransportationBookings = (transportationBookings) => {
  const now = new Date(); // Get the current date and time

  return transportationBookings.reduce(
    (result, booking) => {
      const travelDateTime = new Date(
        `${booking.travelDate}T${booking.travelTime}`
      ); // Combine travelDate and travelTime into a Date object

      if (travelDateTime >= now) {
        result.upcoming.push(booking);
      } else {
        result.past.push(booking);
      }

      return result;
    },
    { upcoming: [], past: [] } // Initialize the result object
  );
};

const categorizeBookings = (bookings, type) => {
  const now = new Date(); // Get the current date and time

  return bookings.reduce(
    (result, booking) => {
      let eventDate;

      // Determine the date field based on the type
      if (type === "itinerary") {
        eventDate = new Date(booking.date); // Use the 'date' field for itineraries
      } else if (type === "activity") {
        eventDate = new Date(booking.date); // Use the 'date' field for activities
      }

      // Categorize as upcoming or past
      if (eventDate >= now) {
        result.upcoming.push(booking);
      } else {
        result.past.push(booking);
      }

      return result;
    },
    { upcoming: [], past: [] } // Initialize the result object
  );
};

const getBookings = async (req, res) => {
  const id = req.user._id;
  const { type } = req.query;
  try {
    const tourist = await userModel.findById(id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    if (type === 'hotel') {
      const hotelBookings = tourist.hotelBookings;
      const categorizedBookings = categorizeHotelBookings(hotelBookings);
      return res.status(200).json(categorizedBookings);
    } else if (type === 'flight') {
      const flightBookings = tourist.flightBookings;
      const categorizedBookings = categorizeFlightBookings(flightBookings);
      return res.status(200).json(categorizedBookings);
    } else if (type === 'transportation') {
      const transportationBookings = tourist.transportationBookings;
      const categorizedBookings = categorizeTransportationBookings(transportationBookings);
      return res.status(200).json(categorizedBookings);
    } else if (type === 'event') {
      const itineraryBookings = tourist.itineraries;
      const activityBookings = tourist.activities;
      const categorizedItineraries = categorizeBookings(itineraryBookings, 'itinerary');
      const categorizedActivities = categorizeBookings(activityBookings, 'activity');
      const result = {
        itineraries: categorizedItineraries,
        activities: categorizedActivities
      };
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: 'Invalid booking type' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch hotel bookings', details: error.message });
  }
}

const generatePromoCode = async (tourist) => {
  try {
    const date = new Date(tourist.DOB);
    const expiry = new Date(date);
    expiry.setDate(date.getDate() + 1);
    const promo = await promoCodeModel.create({
      code: `${tourist.username}Birthday15`,
      discount: 15,
      expiryDate: expiry
    });
    return promo.code;
  } catch (error) {
    throw new Error(`Error generating promo code: ${error.message}`);
  }
}

const sendBirthdayPromo = async (tourist) => {
  try {
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    // Add the tourist's email to recipients
    const recipients = [
      { email: tourist.email },
    ];

    // Prepare the email content
    const sender = {
      name: 'Triptomania',
      email: 'triptomania.app@gmail.com',
    };

    const promoCode = await generatePromoCode(tourist);

    const emailContent = {
      sender,
      to: recipients,
      templateId: 8, // Replace with your Brevo template ID
      params: {
        username: tourist.username,
        promoCode: promoCode
      }
    };

    // Send the email using Brevo transactional API
    const response = await transactionalEmailApi.sendTransacEmail(emailContent);
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
}
// Define the task
const checkAndSendBirthdayPromos = async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // Months are 0-indexed
    const day = today.getDate();

    // Query users with today's DOB
    const usersWithBirthday = await userModel.find({
      $expr: {
        $and: [
          { $eq: [{ $month: "$DOB" }, month] },
          { $eq: [{ $dayOfMonth: "$DOB" }, day] }
        ]
      }
    });

    // Call sendBirthdayPromo for each user
    usersWithBirthday.forEach((user) => {
      sendBirthdayPromo(user); // Pass the full user object
      console.log(`Birthday promo sent for user: ${user.username}`);
    });

    if (usersWithBirthday.length === 0) {
      console.log('No users have birthdays today.');
    }
  } catch (error) {
    console.error('Error checking and sending birthday promos:', error);
  }
};

const now = new Date();

// Calculate 1 minute from now
const oneMinuteFromNow = new Date(now.getTime() + 1 * 60 * 1000);
// Schedule the task for midnight
// schedule.scheduleJob(oneMinuteFromNow, checkAndSendBirthdayPromos);

schedule.scheduleJob(oneMinuteFromNow, async () => {
  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight for comparison

    // Find activities where the date is tomorrow
    const activities = await activityModel.find({
      date: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) } // Tomorrow's date range
    });

    // Find itineraries where the start date is tomorrow
    const itineraries = await itineraryModel.find({
      Start_date: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) } // Tomorrow's start date range
    });

    // For each activity, send notifications to tourists in the bookingMade array
    for (const activity of activities) {
      const tourists = activity.bookingMade; // Array of user IDs (tourists)
      for (const touristId of tourists) {
        const notification = await notificationModel.create({
          title: 'Upcoming Activity',
          body: `Your activity "${activity.name}" is tomorrow. Don't forget to attend!`,
        });
        const notificationEntry = { id: notification.id, read: false };
        await userModel.findByIdAndUpdate(touristId, { $push: { notifications: notificationEntry } });
      }
    }

    // For each itinerary, send notifications to tourists in the bookingMade array
    for (const itinerary of itineraries) {
      const tourists = itinerary.bookingMade; // Array of user IDs (tourists)
      for (const touristId of tourists) {
        const notification = await notificationModel.create({
          title: 'Upcoming Itinerary',
          body: `Your itinerary "${itinerary.Name}" is tomorrow. Don't forget to attend!`,
        });
        const notificationEntry = { id: notification.id, read: false };
        await userModel.findByIdAndUpdate(touristId, { $push: { notifications: notificationEntry } });
      }
    }
  } catch (error) {
    console.error('Error during scheduled job execution:', error);
  }
});

// Export all functions using ES module syntax
export default {
  CreateTourist,
  getTourist,
  getOneTourist,
  UpdateTourist,
  getHotels,
  getHotelOffers,
  bookHotel,
  getBookings,
  searchFlights,
  getFlightDetails,
  bookFlight,
  bookTransportation,
  redeemPoints,
  chooseCategory,
  bookActivity,
  bookItinerary,
  addComment,
  reviewProduct,
  rateTourGuide,
  rateItinerary,
  rateActivity,
  badge,
  processPayment,
  rateProduct,
  updateBadge,
  fileComplaint,
  viewMyComplaints,
  choosePreferences,
  updatePreferences,
  cancelBooking,
  addProductToCart,
  removeProductFromCart,
  changeCartQuantity,
  addDeliveryAdress,
  deleteDeliveryAddress,
  viewOrders,
  viewOrderDetails,
  addProductToWishlist,
  getWishlist,
  getCart,
  removeProductFromWishlist,
  getUpcomingActivities,
  getUpcomingItineraries,
  getPastActivities,
  getPastItineraries,
  bookmarkEvent,
  unbookmarkEvent,
  getBookmarkedEvents
};