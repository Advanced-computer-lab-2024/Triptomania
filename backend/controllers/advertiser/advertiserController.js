import activityModel from '../../models/activity.js'; // Link to advertiser schema
import mongoose from 'mongoose'; // Ensure mongoose is imported for ObjectId validation


 const addActivity = async (req, res) => {
    try {
       const {name,description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen, creatorId} = req.body;
 
       if (!name || !description || !date || !time || !location || !price || !category || !tags || !specialDiscounts || isBookingOpen === undefined || !creatorId) {
          return res.status(400).json({ message: "All required fields must be provided." });
       }
 
       if (typeof name !== 'string'||typeof description !== 'string' ) {
        return res.status(400).json({ message: "Must be a string" });
       }
       if (typeof price !== 'number' || price <= 0) {
          return res.status(400).json({ message: "Price must be a positive number." });
       }
 
       if (specialDiscounts && (typeof specialDiscounts !== 'number' || specialDiscounts < 0)) {
          return res.status(400).json({ message: "Special discounts must be a non-negative number." });
       }

       if(typeof creatorId !== 'number')
       {
         return res.status(400).json({ message: "ID must be a number."});
       }
 
       const newActivity = new activityModel({
          description,
          date,
          time,
          location,
          price,
          category,
          tags,
          specialDiscounts: specialDiscounts || 0, 
          isBookingOpen: isBookingOpen !== undefined ? isBookingOpen : true, 
       });
 
       await newActivity.save();
 
       res.status(201).json({ message: "Booking added successfully", booking: newBooking });
    } catch (error) {
       res.status(500).json({ message: "Error adding booking", error: error.message });
    }
 };
 
 // READ 
  const viewActivities = async (req, res) => {
    try {
       const bookings = await activityModel.find().sort({ createdAt: -1 }); 
       res.status(200).json(bookings);
    } catch (error) {
       res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
 };
 
  const editActivity = async (req, res) => {
    try {
       const { id } = req.params;
       const {name,description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;
 
       if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid booking ID format." });
       }
 
       if (!name || !description || !date || !time || !location || !price || !category || !tags || !specialDiscounts || isBookingOpen === undefined) { 
                  return res.status(400).json({ message: "At least one field must be provided for update." });
       }
 
       const updatedActivity = await activityModel.findOneAndUpdate(
          { _id: id }, 
          {
             $set: {
                name: name !== undefined ? name : undefined,
                description: description !== undefined ? description : undefined,
                date: date !== undefined ? date : undefined,
                time: time !== undefined ? time : undefined,
                location: location !== undefined ? location : undefined,
                price: price !== undefined ? price : undefined,
                category: category !== undefined ? category : undefined,
                tags: tags !== undefined ? tags : undefined,
                specialDiscounts: specialDiscounts !== undefined ? specialDiscounts : undefined,
                isBookingOpen: isBookingOpen !== undefined ? isBookingOpen : undefined,
             }
          }, 
          { new: true, runValidators: true } 
       );
 
       if (!updatedActivity) {
          return res.status(404).json({ message: "Booking not found" });
       }
 
       res.status(200).json({ message: "Activity updated successfully", booking: updatedActivity });
    } catch (error) {
       res.status(500).json({ message: "Error updating actvivty", error: error.message });
    }
 };
 
  const deleteActvivty = async (req, res) => {
    try {
       const { id } = req.params;
 
       if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid booking ID format." });
       }
 
       const deletedActivity = await activityModel.findByIdAndDelete(id);
 
       if (!deletedActivity) {
          return res.status(404).json({ message: "Booking not found" });
       }
 
       res.status(200).json({ message: "Actvivty deleted successfully", activity: deletedActivity });
    } catch (error) {
       res.status(500).json({ message: "Error deleting activivty", error: error.message });
    }
    
 };



const viewMyActivities = async (req, res) => {
   const { creatorId } = req.params; // Extract creatorId from request parameters

   try {
      const activities = await activityModel.find({ creatorId: creatorId });

       if (!activities || activities.length === 0) {
           return res.status(404).json({
               status: false,
               error: 'No activites found for the provided creatorId.'
           });
       }

       res.status(200).json({
           status: true,
           activities: activities
       });
   } catch (err) {
       res.status(500).json({
           status: false,
           error: err.message
       });
   }
};


 export default{
    addActivity,
    editActivity,
    viewActivities,
    deleteActvivty,
    viewMyActivities
 }