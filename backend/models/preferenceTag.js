import mongoose from "mongoose";
const Schema = mongoose.Schema;

const preferenceTagSchema = new Schema({
    PreferenceTagName: {
        type: String,
        required: true,
    },
    PreferenceTagDescription: {
        type: String,
        required: true,
    }
});

const PreferenceTag = mongoose.model('preferenceTag', preferenceTagSchema);
export default PreferenceTag;