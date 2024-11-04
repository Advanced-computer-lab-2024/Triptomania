// Import userModel and other modules using ES module syntax
import userModel from '../../models/tourist.js';

import mongoose from 'mongoose';
import crypto from 'crypto';

// Function to hash passwords
/*const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex'); // SHA-256 hash
};*/

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





//////////////////////////////////////////////////////////////////////

// Export all functions using ES module syntax
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, redeemPoints };
export default { CreateTourist, getTourist, getOneTourist, UpdateTourist, addComment, reviewProduct};
