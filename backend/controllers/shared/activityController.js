import mongoose from 'mongoose';
import activityCategoryModel from '../../models/activityCategory.js';

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

export default {
    addCategory,
    getCategories,
    editCategory,
    deleteCategory
}