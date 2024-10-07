import activityModel from '../../models/activity.js';
import mongoose from 'mongoose';

const addActivity = async (req, res) => {
    try {
        const { name, description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;

        if (!name || !description || !date || !time || !location || !price || !category || !tags || specialDiscounts === undefined || isBookingOpen === undefined) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        if (typeof name !== 'string' || typeof description !== 'string') {
            return res.status(400).json({ message: "Name and description must be strings." });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ message: "Price must be a positive number." });
        }

        const newActivity = new activityModel({
            name,
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
        res.status(201).json({ message: "Activity added successfully", activity: newActivity });
    } catch (error) {
        res.status(500).json({ message: "Error adding activity", error: error.message });
    }
};

const viewActivities = async (req, res) => {
    try {
        const activities = await activityModel.find().sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error: error.message });
    }
};

const editActivity = async (req, res) => {
    const { id } = req.params;
    const { name, description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid activity ID format." });
    }

    const updatedActivity = await activityModel.findOneAndUpdate(
        { _id: id },
        { $set: { name, description, date, time, location, price, category, tags, specialDiscounts, isBookingOpen } },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) {
        return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity updated successfully", activity: updatedActivity });
};

const deleteActivity = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid activity ID format." });
    }

    const deletedActivity = await activityModel.findByIdAndDelete(id);

    if (!deletedActivity) {
        return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully", activity: deletedActivity });
};

export default {
    addActivity,
    editActivity,
    viewActivities,
    deleteActivity
};
