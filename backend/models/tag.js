// models/tag.js
import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure that tag names are unique
    }
}, { timestamps: true });

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
