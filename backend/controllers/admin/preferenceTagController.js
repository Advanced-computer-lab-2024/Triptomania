import mongoose from 'mongoose';
import preferenceTagModel from '../../models/preferenceTag.js';

const addPreferenceTag = async (req, res) => {
    try {
        const { preferenceTagName, preferenceTagDescription } = req.body;

        if (!preferenceTagName || !preferenceTagDescription) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        if (typeof preferenceTagName !== 'string') {
            return res.status(400).json({ message: "PreferenceTagName must be a string." });
        }

        if (typeof preferenceTagDescription !== 'string') {
            return res.status(400).json({ message: "PreferenceTagDescription must be a string." });
        }

        const newPreferenceTag = new preferenceTagModel({
            PreferenceTagName: preferenceTagName,
            PreferenceTagDescription: preferenceTagDescription
        });

        await newPreferenceTag.save();

        res.status(201).json({ message: "Preference Tag added successfully", preferenceTag: newPreferenceTag });
    } catch (error) {
        res.status(500).json({ message: "Error adding preference tag", error: error.message });
    }
};

const getPreferenceTags = async (req, res) => {
    try {
        const preferenceTags = await preferenceTagModel.find();
        res.status(200).json(preferenceTags);
    } catch (error) {
        res.status(500).json({ message: "Error fetching preference tags", error: error.message });
    }
};

const editPreferenceTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { preferenceTagName, preferenceTagDescription } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid preference tag ID format." });
        }

        if (!preferenceTagName && !preferenceTagDescription) {
            return res.status(400).json({ message: "At least one field must be provided for update." });
        }

        const updatedPreferenceTag = await preferenceTagModel.findOneAndUpdate(
            { _id: id },
            { PreferenceTagName: preferenceTagName, PreferenceTagDescription: preferenceTagDescription },
            { new: true }
        );

        res.status(200).json({ message: "Preference Tag updated successfully", preferenceTag: updatedPreferenceTag });
    } catch (error) {
        res.status(500).json({ message: "Error updating preference tag", error: error.message });
    }
};

const deletePreferenceTag = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid preference tag ID format." });
        }

        await preferenceTagModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Preference Tag deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting preference tag", error: error.message });
    }
}

export default {
    addPreferenceTag,
    getPreferenceTags,
    editPreferenceTag,
    deletePreferenceTag
}